const { useState, useEffect, useRef } = React;

// Image Compression Utility
const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 600; // Resize to max 600px width
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Compress to JPEG 0.7
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
    });
};

const AVAILABLE_SUBJECTS = [
    'Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 
    'Economics', 'Government', 'Literature', 'CRS', 'IRS', 'History', 
    'Geography', 'Accounting', 'Commerce'
];

function RegistrationApp() {
    const [activeTab, setActiveTab] = useState('register'); // register, recover, slip
    const [registrationOpen, setRegistrationOpen] = useState(true);
    
    // Registration Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        stateOrigin: '',
        lga: '',
        department: '',
        selectedSubjects: [],
        passport: null
    });
    const [regLoading, setRegLoading] = useState(false);
    const [generatedStudent, setGeneratedStudent] = useState(null);
    const [regError, setRegError] = useState('');
    const fileInputRef = useRef(null);

    // Recover/Slip State
    const [searchQuery, setSearchQuery] = useState(''); // RegNo or Phone
    const [foundStudent, setFoundStudent] = useState(null);
    const [foundTest, setFoundTest] = useState(null); // For Exam Slip
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        const settings = await window.JRStorage.getSettings();
        setRegistrationOpen(settings.registration_open !== false);
    };

    // --- REGISTRATION HANDLERS ---
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const compressed = await compressImage(file);
                setFormData(prev => ({ ...prev, passport: compressed }));
            } catch (e) {
                alert("Error processing image. Please try another.");
            }
        }
    };

    const handleSubjectToggle = (subj) => {
        const current = [...formData.selectedSubjects];
        if (current.includes(subj)) {
            setFormData(prev => ({ ...prev, selectedSubjects: current.filter(s => s !== subj) }));
        } else {
            if (current.length >= 4) {
                alert("You can select maximum 4 subjects.");
                return;
            }
            setFormData(prev => ({ ...prev, selectedSubjects: [...current, subj] }));
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        setRegLoading(true);

        if (!formData.passport) {
            setRegError("Passport photograph is required.");
            setRegLoading(false);
            return;
        }

        if (formData.selectedSubjects.length < 3) {
             setRegError("Please select at least 3 subjects.");
             setRegLoading(false);
             return;
        }

        try {
            const students = await window.JRStorage.getStudents();
            const duplicate = students.find(s => 
                (s.email && s.email.toLowerCase() === formData.email.toLowerCase()) || 
                (s.phone && s.phone === formData.phone)
            );

            if (duplicate) {
                setRegError(`Student already registered (Reg No: ${duplicate.regNumber}). Please use the 'Recover' tab.`);
                setRegLoading(false);
                return;
            }

            const year = new Date().getFullYear();
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const regNumber = `JR${year}${randomNum}`;

            const newStudent = {
                id: 'ST-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                name: formData.fullName,
                regNumber: regNumber,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                stateOrigin: formData.stateOrigin,
                lga: formData.lga,
                department: formData.department,
                selectedSubjects: formData.selectedSubjects,
                passport: formData.passport,
                registeredAt: new Date().toISOString()
            };

            await window.JRStorage.saveStudent(newStudent);
            setGeneratedStudent(newStudent);
        } catch (err) {
            setRegError("System error during registration. Please try resizing your photo or try again later.");
            console.error(err);
        }
        setRegLoading(false);
    };

    // --- RECOVER / SLIP HANDLERS ---
    const handleSearch = async (type) => { 
        setSearchLoading(true);
        setSearchError('');
        setFoundStudent(null);
        setFoundTest(null);

        try {
            const students = await window.JRStorage.getStudents();
            const student = students.find(s => 
                s.regNumber === searchQuery || 
                s.phone === searchQuery || 
                (s.email && s.email.toLowerCase() === searchQuery.toLowerCase())
            );

            if (!student) {
                setSearchError('No student record found with these details.');
            } else {
                setFoundStudent(student);
                if (type === 'slip') {
                    const tests = await window.JRStorage.getTests();
                    const assignedTest = tests.find(t => 
                        t.assignedStudents && t.assignedStudents.includes(student.regNumber)
                    );
                    
                    if (assignedTest) {
                        setFoundTest(assignedTest);
                    } else {
                        setSearchError('You have not been assigned to any specific test schedule yet.');
                        setFoundStudent(null); 
                    }
                }
            }
        } catch (e) {
            setSearchError('Error searching records.');
        }
        setSearchLoading(false);
    };

    // --- RENDER ---
    const renderNav = () => (
        <div className="flex justify-center mb-8 bg-white p-1 rounded-xl shadow-sm border border-gray-100 no-print">
            {[
                { id: 'register', label: 'New Registration', icon: 'icon-user-plus' },
                { id: 'recover', label: 'Recover Reg No', icon: 'icon-search' },
                { id: 'slip', label: 'Print Exam Slip', icon: 'icon-printer' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setGeneratedStudent(null); setFoundStudent(null); setSearchQuery(''); setRegError(''); setSearchError(''); }}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
                        activeTab === tab.id 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    <div className={tab.icon}></div>
                    <span className="hidden md:inline">{tab.label}</span>
                </button>
            ))}
        </div>
    );

    if (generatedStudent) {
        return (
            <div className="min-h-screen py-12 px-4 flex flex-col items-center bg-gray-50">
                <div className="w-full max-w-2xl mb-6 flex justify-between items-center no-print">
                    <button onClick={() => setGeneratedStudent(null)} className="text-gray-600 flex items-center gap-2 hover:text-black">
                        <div className="icon-arrow-left"></div> Back
                    </button>
                    <button onClick={() => window.print()} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700">
                        <div className="icon-printer"></div> Print Slip
                    </button>
                </div>
                <RegistrationSlip student={generatedStudent} title="Registration Confirmation" />
            </div>
        );
    }

    if (activeTab === 'slip' && foundStudent && foundTest) {
         return (
            <div className="min-h-screen py-12 px-4 flex flex-col items-center bg-gray-50">
                <div className="w-full max-w-2xl mb-6 flex justify-between items-center no-print">
                    <button onClick={() => { setFoundStudent(null); setFoundTest(null); }} className="text-gray-600 flex items-center gap-2 hover:text-black">
                        <div className="icon-arrow-left"></div> Back
                    </button>
                    <button onClick={() => window.print()} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-700">
                        <div className="icon-printer"></div> Print Exam Slip
                    </button>
                </div>
                <ExamScheduleSlip student={foundStudent} test={foundTest} />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 flex flex-col items-center bg-gray-50">
            {renderNav()}

            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                {activeTab === 'register' && (
                    <>
                        <div className="text-center mb-8">
                             <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden">
                                 <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-full h-full object-cover" />
                             </div>
                            <h2 className="text-2xl font-bold text-gray-900 uppercase">JR NAGARA ONLINE TEST</h2>
                            <p className="text-gray-500">Candidate Registration Portal</p>
                        </div>

                        {!registrationOpen ? (
                            <div className="text-center p-8 bg-red-50 rounded-xl">
                                <div className="icon-lock text-4xl text-red-500 mx-auto mb-2"></div>
                                <h3 className="font-bold text-red-700">Registration Closed</h3>
                                <p className="text-sm text-red-600">Contact Admin for support.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6">
                                {regError && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{regError}</div>}
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold mb-1">Full Name</label>
                                        <input required name="fullName" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="Surname Firstname" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Email</label>
                                        <input required type="email" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Phone</label>
                                        <input required type="tel" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">State of Origin</label>
                                        <input required name="stateOrigin" value={formData.stateOrigin} onChange={e => setFormData({...formData, stateOrigin: e.target.value})} className="w-full p-3 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">LGA</label>
                                        <input required name="lga" value={formData.lga} onChange={e => setFormData({...formData, lga: e.target.value})} className="w-full p-3 border rounded-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Department</label>
                                        <select required className="w-full p-3 border rounded-lg" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                                            <option value="">Select Department</option>
                                            <option value="Science">Science</option>
                                            <option value="Art">Art</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold mb-2">Subject Selection (Max 4)</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {AVAILABLE_SUBJECTS.map(subj => (
                                                <div 
                                                    key={subj}
                                                    onClick={() => handleSubjectToggle(subj)}
                                                    className={`p-2 rounded border text-xs cursor-pointer select-none transition-all ${
                                                        formData.selectedSubjects.includes(subj) 
                                                        ? 'bg-emerald-600 text-white border-emerald-600' 
                                                        : 'bg-white text-gray-600 hover:border-emerald-400'
                                                    }`}
                                                >
                                                    {subj}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold mb-1">Address</label>
                                        <textarea required name="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 border rounded-lg h-20"></textarea>
                                    </div>
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold mb-1">Passport Photo</label>
                                        <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-300 p-4 text-center rounded-lg cursor-pointer hover:bg-gray-50">
                                            {formData.passport ? (
                                                <img src={formData.passport} className="h-24 w-24 object-cover rounded-full mx-auto" />
                                            ) : (
                                                <div className="text-gray-500">
                                                    <div className="icon-camera text-2xl mb-1"></div>
                                                    <span>Click to upload</span>
                                                </div>
                                            )}
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </div>
                                    </div>
                                </div>

                                <button disabled={regLoading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50">
                                    {regLoading ? 'Registering...' : 'Complete Registration'}
                                </button>
                            </form>
                        )}
                    </>
                )}

                {activeTab === 'recover' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Recover Registration</h2>
                            <p className="text-gray-500">Find your registration details.</p>
                        </div>
                        
                        {searchError && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{searchError}</div>}
                        
                        {!foundStudent ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Enter Phone Number or Email</label>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full p-3 border rounded-lg"
                                        placeholder="e.g. 08012345678"
                                    />
                                </div>
                                <button onClick={() => handleSearch('recover')} disabled={searchLoading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                                    {searchLoading ? 'Searching...' : 'Find Record'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto overflow-hidden mb-4">
                                    <img src={foundStudent.passport} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-xl font-bold">{foundStudent.name}</h3>
                                <p className="text-2xl font-mono text-emerald-600 font-bold my-2">{foundStudent.regNumber}</p>
                                <p className="text-gray-500 text-sm mb-6">Keep this number safe!</p>
                                <button onClick={() => setGeneratedStudent(foundStudent)} className="text-blue-600 underline">Print Registration Slip</button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'slip' && (
                    <div className="space-y-6">
                         <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Print Assignment Slip</h2>
                            <p className="text-gray-500">Check if you have been scheduled for a test.</p>
                        </div>

                         {searchError && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{searchError}</div>}

                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Enter Registration Number</label>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full p-3 border rounded-lg font-mono"
                                    placeholder="e.g. JR2026..."
                                />
                            </div>
                            <button onClick={() => handleSearch('slip')} disabled={searchLoading} className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold">
                                {searchLoading ? 'Checking Schedule...' : 'View Exam Schedule'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8 text-center text-gray-400 text-sm no-print">
                 &copy; 2026 JR NAGARA ONLINE TEST
            </div>
        </div>
    );
}

// Sub-Component: Registration Slip
function RegistrationSlip({ student, title }) {
    return (
        <div className="bg-white p-10 rounded-xl shadow-lg border-2 border-gray-900 w-full max-w-2xl relative overflow-hidden">
             {/* Badge Background Watermark */}
             <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-[70%] h-[70%] object-contain" />
            </div>
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase">JR NAGARA ONLINE TEST</h1>
                    <p className="text-sm font-bold tracking-widest uppercase mt-1 text-emerald-700">{title}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="font-mono font-bold">{new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex gap-8 mb-8 relative z-10">
                <div className="w-32 h-32 bg-gray-100 border-2 border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-md">
                    <img src={student.passport} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div><span className="block text-gray-500 text-xs">Full Name</span><span className="font-bold text-lg">{student.name}</span></div>
                    <div><span className="block text-gray-500 text-xs">Reg Number</span><span className="font-mono font-bold text-xl text-emerald-700">{student.regNumber}</span></div>
                    <div><span className="block text-gray-500 text-xs">Department</span><span className="font-medium">{student.department || 'N/A'}</span></div>
                    <div><span className="block text-gray-500 text-xs">State/LGA</span><span className="font-medium">{student.stateOrigin} / {student.lga}</span></div>
                    <div><span className="block text-gray-500 text-xs">Phone</span><span className="font-medium">{student.phone}</span></div>
                    <div className="col-span-2"><span className="block text-gray-500 text-xs">Subjects</span><span className="font-medium">{student.selectedSubjects ? student.selectedSubjects.join(', ') : 'None'}</span></div>
                </div>
            </div>
            <div className="flex justify-between items-end mt-8 relative z-10">
                <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm max-w-sm">
                    <h3 className="font-bold text-xs uppercase mb-1">Important</h3>
                    <p>This slip is required for entry into the exam hall. Do not share your Registration Number.</p>
                </div>
                 <div className="text-center flex flex-col items-center">
                    <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/206d87e6-a830-431d-8b3e-363a27218dad.jpeg" className="h-14 object-contain -mb-3" />
                    <div className="w-32 border-b border-gray-900 mb-1"></div>
                    <p className="text-[10px] font-bold uppercase">REGISTRAR</p>
                </div>
            </div>
        </div>
    );
}

// Sub-Component: Exam Schedule Slip
function ExamScheduleSlip({ student, test }) {
    const link = `${window.location.origin}/student.html?code=${test.code}`;
    
    return (
        <div className="bg-white p-10 rounded-xl shadow-lg border-2 border-gray-900 w-full max-w-2xl relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-[70%] h-[70%] object-contain" />
            </div>
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8 relative z-10">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase">JR NAGARA ONLINE TEST</h1>
                    <p className="text-sm font-bold tracking-widest uppercase mt-1 text-purple-700">Examination Schedule Slip</p>
                </div>
                 <div className="text-right">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden border border-gray-300">
                         <img src={student.passport} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="mb-8 relative z-10">
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded">
                        <span className="block text-xs text-gray-500">Candidate Name</span>
                        <span className="font-bold">{student.name}</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                         <span className="block text-xs text-gray-500">Registration Number</span>
                        <span className="font-bold font-mono">{student.regNumber}</span>
                    </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-4 text-center border-b pb-2">Examination Details</h3>
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <span className="text-gray-500 block text-xs">Test Title</span>
                            <span className="font-bold">{test.title}</span>
                        </div>
                         <div>
                            <span className="text-gray-500 block text-xs">Test Code</span>
                            <span className="font-bold font-mono">{test.code}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs">Start Time</span>
                            <span className="font-bold">{new Date(test.startTime).toLocaleString()}</span>
                        </div>
                         <div>
                            <span className="text-gray-500 block text-xs">End Time</span>
                            <span className="font-bold">{new Date(test.endTime).toLocaleString()}</span>
                        </div>
                         <div>
                            <span className="text-gray-500 block text-xs">Duration</span>
                            <span className="font-bold">{test.duration} Minutes</span>
                        </div>
                        <div>
                            <span className="text-gray-500 block text-xs">Subjects</span>
                            <span className="font-bold">{test.subjects.map(s => s.name).join(', ')}</span>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-yellow-50 p-4 rounded border border-yellow-200">
                        <span className="block text-xs text-gray-500 font-bold mb-1">Access Link</span>
                        <div className="font-mono text-sm break-all">{link}</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-end mt-4 relative z-10">
                <div className="text-xs text-gray-400">
                    <p>Printed on {new Date().toLocaleString()}</p>
                    <p>No Copying Allowed.</p>
                </div>
                 <div className="text-center flex flex-col items-center">
                    <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/206d87e6-a830-431d-8b3e-363a27218dad.jpeg" className="h-14 object-contain -mb-3" />
                    <div className="w-32 border-b border-gray-900 mb-1"></div>
                    <p className="text-[10px] font-bold uppercase">REGISTRAR</p>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RegistrationApp />);