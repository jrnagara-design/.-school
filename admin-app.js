// Admin Dashboard Components

const { useState, useEffect, useRef } = React;

function Login({ onLogin, portalSettings }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Hardcoded for demo; in production use robust auth
        if (email === 'jrnagara@gmail.com' && password === '@jafar123') {
            onLogin();
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{"paddingTop":"16px","paddingRight":"16px","paddingBottom":"82px","paddingLeft":"17px","marginTop":"0px","marginRight":"78px","marginBottom":"0px","marginLeft":"100px","fontSize":"16px","color":"#ffffff","backgroundColor":"#ffffff","textAlign":"start","fontWeight":"400","objectFit":"fill","display":"flex","position":"relative","top":"0px","left":"0px","right":"0px","bottom":"0px"}} data-vh-processed="screen" className="flex items-center justify-center bg-[#0f172a] p-4 relative overflow-hidden">
             {/* Badge Background Watermark */}
             <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <img src={portalSettings.logo || "https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg"} className="w-[80%] h-[80%] object-contain" />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md relative z-10">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100">
                         <img src={portalSettings.logo || "https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg"} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{portalSettings.name || "Admin Portal"}</h1>
                    <p className="text-gray-500">Secure Access Required</p>
                </div>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full p-3 border rounded-lg"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 border rounded-lg"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors">
                        Login to Dashboard
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <a href="index.html" className="text-sm text-gray-400 hover:text-gray-600">Back to Home</a>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout, portalSettings }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'icon-layout-dashboard' },
        { id: 'tests', label: 'Test Management', icon: 'icon-file-text' },
        { id: 'students', label: 'Students', icon: 'icon-users' },
        { id: 'monitor', label: 'Live Monitor', icon: 'icon-video' },
        { id: 'results', label: 'Results & Analytics', icon: 'icon-chart-bar' },
        { id: 'settings', label: 'Portal Settings', icon: 'icon-settings' },
    ];

    return (
        <div className="w-64 bg-[#0f172a] text-white min-h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-20">
            <div className="p-6 border-b border-gray-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0">
                    <img src={portalSettings.logo || "https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg"} className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                    <h1 className="font-bold tracking-wider text-sm truncate">{portalSettings.shortName || "JR NAGARA"}</h1>
                    <p className="text-[10px] text-gray-400">ADMINISTRATOR</p>
                </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === item.id 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                        <div className={`${item.icon} text-xl`}></div>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
                <button onClick={onLogout} className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors w-full px-4 py-2">
                    <div className="icon-log-out"></div>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

function SettingsManager({ settings, onUpdate }) {
    const [formData, setFormData] = useState({
        portal_name: settings.portal_name || 'JR NAGARA ONLINE TEST',
        portal_short_name: settings.portal_short_name || 'JR NAGARA',
        portal_logo: settings.portal_logo || 'https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg'
    });

    const handleSave = async () => {
        await window.JRStorage.setSetting('portal_name', formData.portal_name);
        await window.JRStorage.setSetting('portal_short_name', formData.portal_short_name);
        await window.JRStorage.setSetting('portal_logo', formData.portal_logo);
        onUpdate();
        alert("Settings Saved!");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Portal Customization</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Portal Name (Full)</label>
                    <input 
                        className="w-full p-2 border rounded" 
                        value={formData.portal_name}
                        onChange={e => setFormData({...formData, portal_name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Short Name / Brand</label>
                    <input 
                        className="w-full p-2 border rounded" 
                        value={formData.portal_short_name}
                        onChange={e => setFormData({...formData, portal_short_name: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Logo URL</label>
                    <input 
                        className="w-full p-2 border rounded" 
                        value={formData.portal_logo}
                        onChange={e => setFormData({...formData, portal_logo: e.target.value})}
                    />
                    <div className="mt-2 text-xs text-gray-500">Preview:</div>
                    <img src={formData.portal_logo} className="h-16 mt-1 object-contain border rounded p-1" />
                </div>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function Dashboard({ setActiveTab }) {
    const [stats, setStats] = useState({ tests: 0, students: 0, active: 0, results: 0 });
    const [regOpen, setRegOpen] = useState(true);
    const [resultsOpen, setResultsOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const tests = await window.JRStorage.getTests() || [];
            const students = await window.JRStorage.getStudents() || [];
            const results = await window.JRStorage.getResults() || [];
            const settings = await window.JRStorage.getSettings() || {};
            
            // Count unique students with results
            const uniqueResultStudents = new Set(results.map(r => r.studentId)).size;
            
            setStats({
                tests: tests.length,
                students: students.length,
                active: 0, 
                results: uniqueResultStudents
            });
            setRegOpen(settings.registration_open !== false); 
            setResultsOpen(settings.results_open !== false);
        } catch (error) {
            console.error("Error loading stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRegistration = async () => {
        const newState = !regOpen;
        setRegOpen(newState);
        await window.JRStorage.setSetting('registration_open', newState);
    };

    const toggleResults = async () => {
        const newState = !resultsOpen;
        setResultsOpen(newState);
        await window.JRStorage.setSetting('results_open', newState);
    };

    const copyLink = (path, name) => {
        const link = `${window.location.origin}/${path}`;
        navigator.clipboard.writeText(link);
        alert(`${name} Link Copied: ${link}`);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border px-4">
                        <span className="text-sm font-bold text-gray-600">Results Access:</span>
                        <button 
                            onClick={toggleResults}
                            className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${resultsOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                            {resultsOpen ? 'ENABLED' : 'DISABLED'}
                        </button>
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border px-4">
                        <span className="text-sm font-bold text-gray-600">Registration:</span>
                        <button 
                            onClick={toggleRegistration}
                            className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${regOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                            {regOpen ? 'OPEN' : 'CLOSED'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Tests</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.tests}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <div className="icon-file-text text-blue-600 text-xl"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Registered Students</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.students}</h3>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <div className="icon-users text-emerald-600 text-xl"></div>
                        </div>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Results Generated</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.results}</h3>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                            <div className="icon-chart-bar text-purple-600 text-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <h3 className="font-bold mb-4">Direct Links</h3>
                     <div className="space-y-3">
                         <button onClick={() => copyLink('register.html', 'Registration')} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between transition-all">
                            <div className="flex items-center space-x-3">
                                <div className="icon-user-plus text-amber-600"></div>
                                <span>Copy Registration Link</span>
                            </div>
                            <div className="icon-copy text-gray-400"></div>
                         </button>
                         <button onClick={() => copyLink('result.html', 'Result')} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between transition-all">
                            <div className="flex items-center space-x-3">
                                <div className="icon-chart-bar text-purple-600"></div>
                                <span>Copy Result Checking Link</span>
                            </div>
                             <div className="icon-copy text-gray-400"></div>
                         </button>
                         <button onClick={() => copyLink('student.html', 'Portal')} className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between transition-all">
                            <div className="flex items-center space-x-3">
                                <div className="icon-graduation-cap text-emerald-600"></div>
                                <span>Copy Exam Portal Link</span>
                            </div>
                             <div className="icon-copy text-gray-400"></div>
                         </button>
                     </div>
                 </div>
             </div>
        </div>
    );
}

function QuestionEditor({ subjectIndex, onSave, onCancel, initialData }) {
    const [question, setQuestion] = useState(initialData || {
        text: '',
        options: ['', '', '', ''],
        correct: 0
    });

    const handleOptionChange = (idx, val) => {
        const newOpts = [...question.options];
        newOpts[idx] = val;
        setQuestion({...question, options: newOpts});
    };

    return (
        <div className="bg-white p-4 rounded border border-gray-300 mt-2">
            <h4 className="font-bold text-sm mb-2">{initialData ? 'Edit Question' : 'Add New Question'}</h4>
            <div className="mb-2">
                <label className="block text-xs font-bold mb-1">Question Text</label>
                <textarea 
                    className="w-full p-2 border rounded text-sm"
                    rows="2"
                    value={question.text}
                    onChange={e => setQuestion({...question, text: e.target.value})}
                    placeholder="Enter question here..."
                ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
                {question.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center">
                        <input 
                            type="radio" 
                            name="correctOpt"
                            checked={question.correct === idx}
                            onChange={() => setQuestion({...question, correct: idx})}
                            className="mr-2"
                        />
                        <input 
                            type="text"
                            className="flex-1 p-1 border rounded text-sm"
                            value={opt}
                            onChange={e => handleOptionChange(idx, e.target.value)}
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        />
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={onCancel} className="text-xs px-3 py-1 bg-gray-200 rounded">Cancel</button>
                <button 
                    onClick={() => {
                        if(question.text && question.options.every(o => o)) {
                            onSave(question);
                            if(!initialData) setQuestion({ text: '', options: ['', '', '', ''], correct: 0 });
                        } else {
                            alert("Please fill all fields");
                        }
                    }} 
                    className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
                >
                    {initialData ? 'Update' : 'Add'}
                </button>
            </div>
        </div>
    );
}

function TestManager() {
    const [tests, setTests] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [activeSubjectForQuestion, setActiveSubjectForQuestion] = useState(null);
    const [assigningTestId, setAssigningTestId] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Edit Mode
    const [editingTestId, setEditingTestId] = useState(null);
    
    const [newTest, setNewTest] = useState({
        title: '',
        code: '',
        duration: 30, 
        startTime: '',
        endTime: '', 
        subjects: [{ name: '', questions: [] }]
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [t, s] = await Promise.all([
            window.JRStorage.getTests(),
            window.JRStorage.getStudents()
        ]);
        setTests(t);
        setStudents(s);
        setLoading(false);
    };

    const handleEdit = (test) => {
        setEditingTestId(test.id);
        setNewTest({
            title: test.title,
            code: test.code,
            duration: test.duration,
            startTime: test.startTime || '',
            endTime: test.endTime || '',
            subjects: test.subjects || []
        });
        setIsCreating(true);
    };

    const handleSave = async () => {
        if(!newTest.title || !newTest.code || newTest.subjects.length === 0) {
            alert("Please fill required fields and add at least one subject.");
            return;
        }

        try {
            const testPayload = {
                ...newTest,
                id: editingTestId || 'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                createdAt: new Date().toISOString(),
                assignedStudents: editingTestId ? (tests.find(t=>t.id===editingTestId)?.assignedStudents || []) : [] 
            };

            await window.JRStorage.saveTest(testPayload);
            await loadData();
            setIsCreating(false);
            setEditingTestId(null);
            setNewTest({ title: '', code: '', duration: 30, startTime: '', endTime: '', subjects: [{ name: '', questions: [] }] });
            alert("Test saved successfully!");
        } catch (e) {
            console.error("Save failed", e);
            alert("Failed to save test. Please try again.");
        }
    };

    const addSubject = () => {
        setNewTest({...newTest, subjects: [...newTest.subjects, { name: '', questions: [] }]});
    };
    
    const updateSubject = (index, field, value) => {
        const subs = [...newTest.subjects];
        subs[index][field] = value;
        setNewTest({...newTest, subjects: subs});
    };

    const addQuestionToSubject = (subjectIndex, question) => {
        const subs = [...newTest.subjects];
        subs[subjectIndex].questions.push({
            id: Date.now(),
            ...question
        });
        setNewTest({...newTest, subjects: subs});
        setActiveSubjectForQuestion(null);
    };

    const copyLink = (code) => {
        const link = `${window.location.origin}/student.html?code=${code}`;
        navigator.clipboard.writeText(link);
        alert(`Direct Link Copied: ${link}`);
    };

    const handleAssignment = async (testId, regNumbers) => {
        const test = tests.find(t => t.id === testId);
        if (test) {
            const updatedTest = { ...test, assignedStudents: regNumbers };
            await window.JRStorage.saveTest(updatedTest);
            await loadData();
            setAssigningTestId(null);
            alert("Assignments updated successfully!");
        }
    };

    const handleDeleteTest = async (id) => {
        if(confirm("Delete this test?")) {
            await window.JRStorage.deleteTest(id);
            loadData();
        }
    }

    const notifyStudents = (testId) => {
        alert("System Simulation: Emails sent to all assigned students with their exam slip link.");
    };

    if(loading && !assigningTestId) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Test Management</h2>
                <button 
                    onClick={() => {
                        setEditingTestId(null);
                        setNewTest({ title: '', code: '', duration: 30, startTime: '', endTime: '', subjects: [{ name: '', questions: [] }] });
                        setIsCreating(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
                >
                    <div className="icon-plus"></div>
                    <span>Create Test</span>
                </button>
            </div>

            {/* Creating Interface */}
            {isCreating && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-bold mb-4">{editingTestId ? 'Edit Test' : 'Create New Test'}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Test Title</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded"
                                value={newTest.title}
                                onChange={e => setNewTest({...newTest, title: e.target.value})}
                                placeholder="e.g. 2026 UTME Mock"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Test Code (Unique ID)</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border rounded"
                                value={newTest.code}
                                onChange={e => setNewTest({...newTest, code: e.target.value})}
                                placeholder="e.g. 2026-MOCK-001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Time (Access Open)</label>
                            <input 
                                type="datetime-local" 
                                className="w-full p-2 border rounded"
                                value={newTest.startTime}
                                onChange={e => setNewTest({...newTest, startTime: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">End Time (Access Expired)</label>
                            <input 
                                type="datetime-local" 
                                className="w-full p-2 border rounded"
                                value={newTest.endTime}
                                onChange={e => setNewTest({...newTest, endTime: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Duration (Minutes)</label>
                            <input 
                                type="number" 
                                className="w-full p-2 border rounded"
                                value={newTest.duration}
                                onChange={e => setNewTest({...newTest, duration: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Subjects & Questions</label>
                        {newTest.subjects.map((sub, idx) => (
                            <div key={idx} className="bg-white p-4 rounded border mb-3">
                                <div className="flex gap-2 mb-2 items-center">
                                    <span className="font-bold text-gray-500">#{idx+1}</span>
                                    <input 
                                        type="text" 
                                        placeholder="Subject Name (e.g. Mathematics)"
                                        className="flex-1 p-2 border rounded"
                                        value={sub.name}
                                        onChange={e => updateSubject(idx, 'name', e.target.value)}
                                    />
                                    <div className="text-sm text-gray-500">{sub.questions.length} Questions</div>
                                    <button 
                                        onClick={() => {
                                            const subs = [...newTest.subjects];
                                            subs.splice(idx, 1);
                                            setNewTest({...newTest, subjects: subs});
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <div className="icon-trash"></div>
                                    </button>
                                </div>
                                
                                {activeSubjectForQuestion === idx ? (
                                    <QuestionEditor 
                                        subjectIndex={idx} 
                                        onSave={(q) => addQuestionToSubject(idx, q)}
                                        onCancel={() => setActiveSubjectForQuestion(null)}
                                    />
                                ) : (
                                    <button 
                                        onClick={() => setActiveSubjectForQuestion(idx)}
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                    >
                                        <div className="icon-plus-circle text-xs"></div> Add Question
                                    </button>
                                )}
                            </div>
                        ))}
                        <button onClick={addSubject} className="text-sm text-emerald-600 font-bold flex items-center gap-1 mt-2">
                            <div className="icon-plus text-xs"></div> Add New Subject
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
                            {editingTestId ? 'Update Test' : 'Save Test'}
                        </button>
                        <button onClick={() => { setIsCreating(false); setEditingTestId(null); }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {assigningTestId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <h3 className="text-lg font-bold mb-4">Assign Students to Test</h3>
                        <div className="flex-1 overflow-y-auto mb-4 border rounded p-2">
                             {students.length === 0 ? <p className="text-gray-500 p-4">No registered students found.</p> : (
                                 <div className="grid grid-cols-1 gap-2">
                                     <label className="flex items-center p-2 bg-gray-50 rounded font-bold">
                                         <input type="checkbox" className="mr-3" 
                                             onChange={(e) => {
                                                 const allRegs = e.target.checked ? students.map(s => s.regNumber) : [];
                                                 handleAssignment(assigningTestId, allRegs);
                                             }}
                                         />
                                         Select All / None (Caution)
                                     </label>
                                     {students.map(s => {
                                         const currentTest = tests.find(t => t.id === assigningTestId);
                                         const isAssigned = currentTest.assignedStudents && currentTest.assignedStudents.includes(s.regNumber);
                                         return (
                                             <label key={s.id} className="flex items-center p-2 hover:bg-gray-50 rounded border cursor-pointer">
                                                 <input 
                                                     type="checkbox" 
                                                     className="mr-3" 
                                                     checked={!!isAssigned}
                                                     onChange={(e) => {
                                                         let newAssigned = currentTest.assignedStudents || [];
                                                         if (e.target.checked) {
                                                             newAssigned = [...newAssigned, s.regNumber];
                                                         } else {
                                                             newAssigned = newAssigned.filter(r => r !== s.regNumber);
                                                         }
                                                         // UI Update only
                                                         const updatedTests = [...tests];
                                                         const tIdx = updatedTests.findIndex(t => t.id === assigningTestId);
                                                         updatedTests[tIdx].assignedStudents = newAssigned;
                                                         setTests(updatedTests);
                                                     }}
                                                 />
                                                 <div>
                                                     <span className="font-bold">{s.name}</span>
                                                     <span className="text-xs text-gray-500 ml-2">({s.regNumber})</span>
                                                 </div>
                                             </label>
                                         );
                                     })}
                                 </div>
                             )}
                        </div>
                        <div className="flex justify-between items-center">
                             <button 
                                 onClick={() => notifyStudents(assigningTestId)}
                                 className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-2"
                             >
                                 <div className="icon-mail"></div> Notify Selected Students
                             </button>
                             <div className="flex gap-2">
                                 <button onClick={() => setAssigningTestId(null)} className="px-4 py-2 text-gray-600">Cancel</button>
                                 <button 
                                     onClick={() => {
                                         const currentTest = tests.find(t => t.id === assigningTestId);
                                         handleAssignment(assigningTestId, currentTest.assignedStudents || []);
                                     }}
                                     className="bg-blue-600 text-white px-4 py-2 rounded"
                                 >
                                     Save Assignments
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-3 text-left">Code</th>
                            <th className="p-3 text-left">Title</th>
                            <th className="p-3 text-left">Assigned</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tests.map(test => (
                            <tr key={test.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono text-sm">{test.code}</td>
                                <td className="p-3 font-medium">{test.title}</td>
                                <td className="p-3 text-sm">
                                    {(test.assignedStudents && test.assignedStudents.length > 0) 
                                        ? <span className="text-green-600 font-bold">{test.assignedStudents.length} Candidates</span> 
                                        : <span className="text-gray-400">Open to All</span>}
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(test)}
                                        className="text-gray-600 hover:text-black p-1 border border-gray-200 rounded"
                                        title="Edit Test"
                                    >
                                        <div className="icon-pencil"></div>
                                    </button>
                                    <button 
                                        onClick={() => setAssigningTestId(test.id)}
                                        className="text-purple-600 hover:text-purple-800 p-1 border border-purple-200 rounded"
                                        title="Assign Students"
                                    >
                                        <div className="icon-users"></div>
                                    </button>
                                    <button 
                                        onClick={() => copyLink(test.code)}
                                        className="text-blue-600 hover:text-blue-800 p-1 border border-blue-200 rounded"
                                        title="Copy Direct Link"
                                    >
                                        <div className="icon-link"></div>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteTest(test.id)} 
                                        className="text-red-600 hover:text-red-800 p-1 border border-red-200 rounded"
                                        title="Delete Test"
                                    >
                                        <div className="icon-trash"></div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// StudentManager (mostly same, slight update to display departments if needed)
function StudentManager() {
    const [students, setStudents] = useState([]);
    const [receiptStudent, setReceiptStudent] = useState(null);
    const [viewStudent, setViewStudent] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    
    // Receipt Edit State
    const [receiptData, setReceiptData] = useState({ amount: '5,000.00', purpose: 'UTME PRACTICE' });
    const [isEditingReceipt, setIsEditingReceipt] = useState(false);

    // Manual Add State
    const [newStudent, setNewStudent] = useState({
        name: '', email: '', phone: '', stateOrigin: '', lga: '', address: '', department: '',
        customRegNumber: '' 
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        const s = await window.JRStorage.getStudents();
        setStudents(s);
    };

    const handleDelete = async (regNumber) => {
        if(confirm("Are you sure you want to PERMANENTLY remove this student?")) {
            await window.JRStorage.deleteStudent(regNumber);
            loadStudents();
        }
    };

    const handleManualAdd = async () => {
        if(!newStudent.name || !newStudent.phone) {
            alert("Name and Phone are required.");
            return;
        }
        
        let regNumber = newStudent.customRegNumber;
        if (!regNumber) {
            const year = new Date().getFullYear();
            const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            regNumber = `JR${year}${randomNum}`;
        }
        
        // Check duplicate reg
        const existing = students.find(s => s.regNumber === regNumber);
        if(existing) {
            alert(`Registration Number ${regNumber} already exists!`);
            return;
        }

        const studentData = {
            id: 'ST-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            ...newStudent,
            regNumber: regNumber,
            registeredAt: new Date().toISOString(),
            passport: null 
        };
        // Clean up UI field
        delete studentData.customRegNumber;

        try {
            await window.JRStorage.saveStudent(studentData);
            alert(`Student Added! Reg No: ${regNumber}`);
            setIsAdding(false);
            setNewStudent({ name: '', email: '', phone: '', stateOrigin: '', lga: '', address: '', department: '', customRegNumber: '' });
            loadStudents();
        } catch(e) {
            alert("Error adding student.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Registered Students</h3>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                    >
                        <div className="icon-plus"></div> Add Student
                    </button>
                    <div className="text-sm text-gray-500">Total: {students.length}</div>
                </div>
            </div>

            {isAdding && (
                <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                    <h4 className="font-bold mb-3">Manual Registration</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <input className="p-2 border rounded" placeholder="Full Name" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                        <input className="p-2 border rounded" placeholder="Phone" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} />
                        <input className="p-2 border rounded" placeholder="Email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} />
                        <input className="p-2 border rounded" placeholder="Department" value={newStudent.department} onChange={e => setNewStudent({...newStudent, department: e.target.value})} />
                        <div className="col-span-2">
                             <input className="p-2 border rounded w-full border-blue-300 bg-blue-50" placeholder="Custom Registration Number (Optional - Leave blank to auto-generate)" value={newStudent.customRegNumber} onChange={e => setNewStudent({...newStudent, customRegNumber: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleManualAdd} className="bg-blue-600 text-white px-4 py-1 rounded text-sm">Save</button>
                        <button onClick={() => setIsAdding(false)} className="bg-gray-300 text-black px-4 py-1 rounded text-sm">Cancel</button>
                    </div>
                </div>
            )}
            
            <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b sticky top-0">
                        <tr>
                            <th className="p-3 text-left">Student Details</th>
                            <th className="p-3 text-left">Contact</th>
                            <th className="p-3 text-left">Department</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.id} className="border-b">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                            {student.passport ? 
                                                <img src={student.passport} className="w-full h-full object-cover" /> :
                                                <div className="icon-user w-full h-full flex items-center justify-center text-gray-400"></div>
                                            }
                                        </div>
                                        <div>
                                            <div className="font-bold">{student.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{student.regNumber}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-sm">
                                    <div className="text-gray-900">{student.phone}</div>
                                    <div className="text-gray-500 text-xs">{student.email}</div>
                                </td>
                                <td className="p-3 text-sm">
                                    {student.department || 'N/A'}
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => setViewStudent(student)} className="text-gray-600 hover:bg-gray-100 p-1 rounded" title="View Full Details">
                                        <div className="icon-eye"></div>
                                    </button>
                                    <button onClick={() => setReceiptStudent(student)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Print Receipt">
                                        <div className="icon-printer"></div>
                                    </button>
                                    <button onClick={() => handleDelete(student.regNumber)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Remove">
                                        <div className="icon-trash"></div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {viewStudent && (
                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg p-6 rounded-xl relative">
                        <button onClick={() => setViewStudent(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
                            <div className="icon-x text-2xl"></div>
                        </button>
                        <h3 className="text-xl font-bold mb-6">Student Profile</h3>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 mb-4">
                                {viewStudent.passport ? 
                                    <img src={viewStudent.passport} className="w-full h-full object-cover" /> :
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
                                }
                            </div>
                            <h2 className="text-2xl font-bold">{viewStudent.name}</h2>
                            <p className="font-mono text-emerald-600 font-bold">{viewStudent.regNumber}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded">
                                <span className="block text-gray-500 text-xs">Email</span>
                                <span className="font-medium">{viewStudent.email}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <span className="block text-gray-500 text-xs">Phone</span>
                                <span className="font-medium">{viewStudent.phone}</span>
                            </div>
                             <div className="p-3 bg-gray-50 rounded">
                                <span className="block text-gray-500 text-xs">Department</span>
                                <span className="font-medium">{viewStudent.department || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <span className="block text-gray-500 text-xs">Registered</span>
                                <span className="font-medium">{new Date(viewStudent.registeredAt).toLocaleDateString()}</span>
                            </div>
                             <div className="p-3 bg-gray-50 rounded col-span-2">
                                <span className="block text-gray-500 text-xs">Subjects</span>
                                <span className="font-medium">{viewStudent.selectedSubjects ? viewStudent.selectedSubjects.join(', ') : 'None'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
             {/* Receipt Modal with Edit */}
             {receiptStudent && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md p-0 overflow-hidden rounded shadow-2xl relative">
                         {isEditingReceipt ? (
                             <div className="p-6">
                                 <h3 className="font-bold mb-4">Edit Receipt Details</h3>
                                 <div className="mb-4">
                                     <label className="block text-xs font-bold mb-1">Amount</label>
                                     <input className="w-full p-2 border rounded" value={receiptData.amount} onChange={e => setReceiptData({...receiptData, amount: e.target.value})} />
                                 </div>
                                 <div className="mb-4">
                                     <label className="block text-xs font-bold mb-1">Purpose/Item</label>
                                     <input className="w-full p-2 border rounded" value={receiptData.purpose} onChange={e => setReceiptData({...receiptData, purpose: e.target.value})} />
                                 </div>
                                 <button onClick={() => setIsEditingReceipt(false)} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Done</button>
                             </div>
                         ) : (
                             <>
                                <button onClick={() => setReceiptStudent(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 no-print">
                                    <div className="icon-x-circle text-2xl"></div>
                                </button>
                                
                                <div id="receipt-area" className="p-8 border-4 border-double border-gray-300 m-4 relative overflow-hidden">
                                     {/* Watermark */}
                                     <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                                        <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-[80%] h-[80%] object-contain" />
                                    </div>

                                    <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4 relative z-10">
                                        <h1 className="text-xl font-black uppercase">JR NGR</h1>
                                        <p className="text-xs tracking-widest">Official Payment Receipt</p>
                                    </div>
                                    
                                    <div className="space-y-4 text-sm font-mono mb-6 relative z-10">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Date:</span>
                                            <span>{new Date().toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Receipt No:</span>
                                            <span>MANUAL-{Math.floor(Math.random()*100000)}</span>
                                        </div>
                                        <div className="border-t border-dashed border-gray-200 my-2"></div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Student Name:</span>
                                            <span className="font-bold text-right">{receiptStudent.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Reg No:</span>
                                            <span className="font-bold">{receiptStudent.regNumber}</span>
                                        </div>
                                         <div className="flex justify-between">
                                            <span className="text-gray-500">Payment For:</span>
                                            <span className="font-bold">{receiptData.purpose}</span>
                                        </div>
                                        <div className="border-t border-dashed border-gray-200 my-2"></div>
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>TOTAL PAID:</span>
                                            <span>₦ {receiptData.amount}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-center text-[10px] text-gray-400 mt-6 relative z-10">
                                        <p>Admin Generated - JR NGR Portal</p>
                                    </div>
                                </div>

                                <div className="bg-gray-100 p-4 flex justify-between no-print">
                                    <button onClick={() => setIsEditingReceipt(true)} className="text-blue-600 text-xs font-bold underline">Edit Details</button>
                                    <button onClick={() => window.print()} className="bg-blue-900 text-white px-6 py-2 rounded font-bold flex items-center gap-2">
                                        <div className="icon-printer"></div> Print Now
                                    </button>
                                </div>
                             </>
                         )}
                    </div>
                </div>
            )}
        </div>
    );
}

// LiveMonitor - Professional CCTV Style
function LiveMonitor() {
    const [sessions, setSessions] = useState({});
    const [msgText, setMsgText] = useState('');
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        // High frequency refresh for "movement" effect (Snapshot polling)
        const fetchInterval = setInterval(async () => {
            try {
                const sess = await window.JRStorage.getLiveSessions() || {};
                setSessions(sess);
            } catch (e) {
                // Silent catch
            }
        }, 1000); 

        // Local UI timer for "Last Seen X seconds ago" update
        const timerInterval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => {
            clearInterval(fetchInterval);
            clearInterval(timerInterval);
        };
    }, []);

    const sendMessage = async (studentId) => {
        if(!msgText) return;
        await window.JRStorage.sendMessage(studentId, msgText);
        setMsgText('');
        alert(`Message sent to ${studentId}!`);
    };

    const sessionList = Object.entries(sessions);
    
    // FILTER: Only active students (last seen < 30 seconds ago)
    const activeSessions = sessionList.filter(([_, s]) => {
         const lastSeenMs = new Date(s.lastSeen).getTime();
         const diffSeconds = (Date.now() - lastSeenMs) / 1000;
         return diffSeconds < 30; // 30s threshold
    });

    const activeCount = activeSessions.length;

    return (
        <div className="bg-[#1e293b] p-6 rounded-xl shadow-2xl min-h-[calc(100vh-100px)] text-gray-200 border border-gray-700 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <div>
                    <h2 className="text-xl font-bold flex items-center text-white tracking-wider">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3 shadow-[0_0_10px_#ef4444]"></div>
                        SECURITY MONITORING CENTER
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-mono">SYSTEM STATUS: ONLINE | ACTIVE FEEDS: {activeCount}</p>
                </div>
                <div className="text-right font-mono text-sm text-emerald-500">
                    {new Date(currentTime).toLocaleTimeString()}
                </div>
            </div>

            {activeSessions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/50">
                    <div className="icon-monitor-off text-6xl mb-4 opacity-50"></div>
                    <p className="text-lg font-bold">NO ACTIVE SESSIONS</p>
                    <p className="text-sm">Waiting for candidates to connect...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
                    {activeSessions.map(([id, session]) => {
                        const lastSeenMs = new Date(session.lastSeen).getTime();
                        const diffSeconds = Math.floor((currentTime - lastSeenMs) / 1000);
                        const isOnline = diffSeconds < 15;
                        const borderColor = isOnline ? 'border-emerald-500/50' : 'border-red-500/50';
                        const statusText = isOnline ? 'LIVE' : `DELAY ${diffSeconds}s`;
                        const statusColor = isOnline ? 'text-emerald-400' : 'text-red-400';

                        return (
                            <div key={id} className={`bg-gray-900 border-2 ${borderColor} rounded-lg overflow-hidden flex flex-col shadow-lg transition-all hover:border-blue-500/50`}>
                                {/* Header */}
                                <div className="bg-gray-800 px-3 py-2 flex justify-between items-center border-b border-gray-700">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        <span className="font-mono text-xs font-bold truncate text-white max-w-[120px]" title={session.name}>{session.name}</span>
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold ${statusColor}`}>{statusText}</span>
                                </div>
                                
                                {/* Feed */}
                                <div className="relative aspect-video bg-black flex items-center justify-center group">
                                    {session.snapshot ? (
                                        <img src={session.snapshot} className="w-full h-full object-cover opacity-90" />
                                    ) : (
                                        <div className="flex flex-col items-center opacity-30">
                                            <div className="icon-video-off text-4xl mb-2"></div>
                                            <span className="text-[10px]">NO SIGNAL</span>
                                        </div>
                                    )}
                                    
                                    {/* Overlay Info */}
                                    <div className="absolute top-2 left-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] font-mono text-white border border-white/10">
                                        CAM-{id.slice(-4)}
                                    </div>
                                    
                                    {/* Warnings */}
                                    {session.warningCount > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse shadow-lg">
                                            WARN: {session.warningCount}
                                        </div>
                                    )}

                                    {/* Movement Indicator (Visual Gimmick) */}
                                    {isOnline && (
                                        <div className="absolute bottom-2 right-2 flex space-x-0.5">
                                            <div className="w-0.5 h-3 bg-green-500 animate-[pulse_0.5s_ease-in-out_infinite]"></div>
                                            <div className="w-0.5 h-2 bg-green-500 animate-[pulse_0.7s_ease-in-out_infinite]"></div>
                                            <div className="w-0.5 h-4 bg-green-500 animate-[pulse_0.3s_ease-in-out_infinite]"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Controls */}
                                <div className="p-2 bg-gray-800 border-t border-gray-700 space-y-2">
                                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                        <span>ID: {session.regNumber}</span>
                                        <span>TEST: {session.testCode}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <input 
                                            type="text" 
                                            placeholder="Alert candidate..."
                                            className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
                                            value={selectedStudent === id ? msgText : ''}
                                            onChange={(e) => {
                                                setSelectedStudent(id);
                                                setMsgText(e.target.value);
                                            }}
                                            onKeyPress={(e) => {
                                                if(e.key === 'Enter') sendMessage(session.regNumber, msgText);
                                            }}
                                        />
                                        <button 
                                            onClick={() => sendMessage(session.regNumber, msgText)}
                                            className="bg-blue-600 hover:bg-blue-500 text-white px-2 rounded text-xs flex items-center justify-center"
                                            title="Send Message"
                                        >
                                            <div className="icon-send"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function ResultsView() {
    const [results, setResults] = useState([]);
    const [printResult, setPrintResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
         try {
             const res = await window.JRStorage.getResults();
             // FORCE UPDATE: Sometimes Storage returns cached or pagination partials?
             // Not really, but good to check. 
             setResults(res);
             
             // Analytics
             if(res.length > 0) {
                 const scores = res.map(r => r.score);
                 const avg = scores.reduce((a,b)=>a+b,0) / scores.length;
                 const max = Math.max(...scores);
                 const total = scores.reduce((a,b)=>a+b,0);
                 setStats({ avg: Math.round(avg), max, total });
             }
         } catch(e) {
             console.error("Failed to load results", e);
         } finally {
             setLoading(false);
         }
    }

    const toggleApprove = async (result, approvedStatus) => {
        await window.JRStorage.update(
            'result', 
            result._id, 
            { ...result, approved: approvedStatus }
        );
        load();
    };

    const handleDeleteResult = async (resultId) => {
        if(confirm("Permanently delete this result?")) {
            await window.JRStorage.delete('result', resultId);
            load();
        }
    }

    if (printResult) {
        // Minimal Print View for Admin
        return (
            <div className="fixed inset-0 bg-white z-50 overflow-auto">
                <div className="p-4 no-print flex justify-between bg-gray-100 mb-4">
                    <button onClick={() => setPrintResult(null)} className="font-bold">Close</button>
                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-1 rounded">Print Now</button>
                </div>
                <div className="max-w-2xl mx-auto border-2 border-black p-8 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-96 h-96 object-contain" />
                    </div>
                    <div className="text-center border-b-2 border-black pb-4 mb-4">
                        <h1 className="text-3xl font-black uppercase">JR NAGARA ONLINE TEST</h1>
                        <p className="font-bold">UTME PRACTICE RESULT SHEET</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div><b>Name:</b> {printResult.studentName}</div>
                        <div><b>Reg No:</b> {printResult.studentId}</div>
                        <div><b>Test:</b> {printResult.testCode}</div>
                        <div><b>Date:</b> {new Date().toLocaleDateString()}</div>
                    </div>
                    <table className="w-full border-collapse border border-black mb-6">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-black p-2 text-left">Subject</th>
                                <th className="border border-black p-2 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.filter(r => r.studentId === printResult.studentId && r.testCode === printResult.testCode).map((r, i) => (
                                <tr key={i}>
                                    <td className="border border-black p-2">{r.subject}</td>
                                    <td className="border border-black p-2 text-right font-bold">{r.score}</td>
                                </tr>
                            ))}
                             <tr className="bg-gray-100">
                                <td className="border border-black p-2 font-bold text-right">TOTAL</td>
                                <td className="border border-black p-2 text-right font-bold text-xl">
                                    {results.filter(r => r.studentId === printResult.studentId && r.testCode === printResult.testCode).reduce((a,b)=>a+b.score, 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="flex justify-between items-end mt-12">
                         <div className="text-center flex flex-col items-center">
                             {/* REMOVED SPECIFIC SIGNATURE AS REQUESTED, USE TEXT INSTEAD */}
                             <div className="text-2xl font-signature font-bold italic mb-2">Authorized Signatory</div>
                             <div className="border-t border-black w-48 mt-1"></div>
                             <p className="text-xs font-bold mt-1">FOR: JR NAGARA MANAGEMENT</p>
                         </div>
                         <div className="text-xs text-right">
                             Generated from Admin Portal<br/>
                             JR NAGARA ONLINE TEST
                         </div>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) return <div>Loading results...</div>;

    // Group by student for better view
    const grouped = {};
    results.forEach(r => {
        if(!grouped[r.studentId]) grouped[r.studentId] = { 
            name: r.studentName, 
            id: r.studentId, 
            test: r.testCode,
            results: []
        };
        grouped[r.studentId].results.push(r);
    });

    return (
        <div className="space-y-6">
            {/* Analytics Panel */}
            {stats && (
                 <div className="grid grid-cols-3 gap-4 mb-6">
                     <div className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500">
                         <div className="text-gray-500 text-xs">Average Score</div>
                         <div className="text-2xl font-bold">{stats.avg}</div>
                     </div>
                     <div className="bg-white p-4 rounded shadow-sm border-l-4 border-green-500">
                         <div className="text-gray-500 text-xs">Highest Score</div>
                         <div className="text-2xl font-bold">{stats.max}</div>
                     </div>
                      <div className="bg-white p-4 rounded shadow-sm border-l-4 border-purple-500">
                         <div className="text-gray-500 text-xs">Total Records</div>
                         <div className="text-2xl font-bold">{results.length}</div>
                     </div>
                 </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Student Results</h2>
                    <button onClick={load} className="text-sm text-blue-600 hover:underline">Refresh List</button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                 <th className="p-3 text-left">Student</th>
                                 <th className="p-3 text-left">Test</th>
                                 <th className="p-3 text-left">Subjects Taken</th>
                                 <th className="p-3 text-left">Aggregate</th>
                                 <th className="p-3 text-left">Status</th>
                                 <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(grouped).map((group, i) => {
                                const agg = group.results.reduce((a, b) => a + b.score, 0);
                                const isApproved = group.results.every(r => r.approved);
                                return (
                                    <tr key={i} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="font-medium">{group.name}</div>
                                            <div className="text-xs text-gray-500 font-mono">{group.id}</div>
                                        </td>
                                        <td className="p-3">{group.test}</td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap gap-1">
                                                {group.results.map((r, idx) => (
                                                    <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{r.subject}: {r.score}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-3 font-bold text-lg">{agg}</td>
                                        <td className="p-3">
                                            {isApproved ? 
                                                <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">Approved</span> : 
                                                <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-1 rounded">Pending</span>
                                            }
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            <button 
                                                onClick={() => setPrintResult(group.results[0])}
                                                className="text-blue-600 hover:bg-blue-50 p-1 border border-blue-200 rounded"
                                                title="Print Result Slip"
                                            >
                                                <div className="icon-printer"></div>
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    group.results.forEach(r => toggleApprove(r, !isApproved));
                                                }}
                                                className={`p-1 rounded border ${isApproved ? 'text-amber-600 border-amber-200' : 'text-green-600 border-green-200'}`}
                                                title={isApproved ? "Revoke Approval" : "Approve Result"}
                                            >
                                                {isApproved ? <div className="icon-x-circle"></div> : <div className="icon-circle-check"></div>}
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    group.results.forEach(r => handleDeleteResult(r._id));
                                                }}
                                                className="text-red-600 hover:bg-red-50 p-1 border border-red-200 rounded" 
                                                title="Delete Result"
                                            >
                                                <div className="icon-trash"></div>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {Object.keys(grouped).length === 0 && (
                                <tr><td colSpan="6" className="p-6 text-center text-gray-400">No results found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Main App Container
function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [portalSettings, setPortalSettings] = useState({});

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const s = await window.JRStorage.getSettings();
        setPortalSettings(s);
    };

    if (!isAuthenticated) {
        return <Login onLogin={() => setIsAuthenticated(true)} portalSettings={portalSettings} />;
    }

    return (
        <div className="flex">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={() => setIsAuthenticated(false)} portalSettings={portalSettings} />
            <main className="flex-1 ml-64 p-8 min-h-screen relative">
                {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
                {activeTab === 'tests' && <TestManager />}
                {activeTab === 'students' && <StudentManager />}
                {activeTab === 'monitor' && <LiveMonitor />}
                {activeTab === 'results' && <ResultsView />}
                {activeTab === 'settings' && <SettingsManager settings={portalSettings} onUpdate={loadSettings} />}
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);