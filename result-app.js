const { useState, useEffect } = React;

function ResultChecker() {
    const [regNumber, setRegNumber] = useState('');
    const [testCode, setTestCode] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [studentInfo, setStudentInfo] = useState(null);
    const [accessClosed, setAccessClosed] = useState(false);

    // Check status first
    useEffect(() => {
        checkAccess();
    }, []);

    const checkAccess = async () => {
         const settings = await window.JRStorage.getSettings();
         if(settings.results_open === false) {
             setAccessClosed(true);
         } else {
             // Check query params
             const params = new URLSearchParams(window.location.search);
             const regParam = params.get('regNum');
             const codeParam = params.get('testCode');

             if(regParam) {
                 setRegNumber(regParam);
                 if(codeParam) {
                     setTestCode(codeParam);
                     setTimeout(() => performCheck(regParam, codeParam), 500);
                 }
             }
         }
    };

    const performCheck = async (reg, code) => {
        if(accessClosed) return;
        setLoading(true);
        setError('');
        try {
            const allResults = await window.JRStorage.getResults();
            // Filter: Match Reg, Match Code (if provided), AND MUST BE APPROVED
            const studentResults = allResults.filter(r => 
                r.studentId === reg && 
                (!code || r.testCode === code) &&
                r.approved === true
            );

            if (studentResults.length === 0) {
                setError('No approved results found. Please check details or contact admin.');
                setResults(null);
                setStudentInfo(null);
            } else {
                setResults(studentResults);
                
                // Fetch student info for photo/details
                const allStudents = await window.JRStorage.getStudents();
                const s = allStudents.find(st => st.regNumber === reg);
                setStudentInfo(s);
            }
        } catch (e) {
            setError('Error fetching results. Please try again.');
        }
        setLoading(false);
    };

    const handleCheck = (e) => {
        e.preventDefault();
        performCheck(regNumber, testCode);
    };

    const handlePrint = async () => {
        // Increment print count for records
        if(results && results.length > 0) {
            // Just update first record to track or loop all?
            // Let's update all associated with this print view
            for(const r of results) {
                 await window.JRStorage.update('result', r._id, { 
                     ...r, 
                     printedCount: (r.printedCount || 0) + 1 
                 });
            }
        }
        window.print();
    };

    if(accessClosed) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-red-100">
                    <div className="icon-lock text-4xl text-red-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Portal Closed</h2>
                    <p className="text-gray-500">Result checking is currently unavailable. Please check back later.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12 px-4">
            {/* Checker Form */}
            {!results && (
                <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="text-center mb-8">
                         <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                            <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-bold uppercase">Check Results</h1>
                        <p className="text-gray-500">JR NAGARA ONLINE TEST</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleCheck} className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium mb-1">Registration Number</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded outline-none focus:border-purple-600 transition-colors"
                                value={regNumber}
                                onChange={e => setRegNumber(e.target.value)}
                                placeholder="e.g. JR2026..."
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Test Code</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded outline-none focus:border-purple-600 transition-colors"
                                value={testCode}
                                onChange={e => setTestCode(e.target.value)}
                                placeholder="e.g. 2026-MOCK..."
                                required
                            />
                        </div>
                        <button disabled={loading} className="w-full bg-purple-600 text-white py-3 rounded font-bold hover:bg-purple-700 transition-colors disabled:opacity-50">
                            {loading ? 'Checking...' : 'Check Result'}
                        </button>
                    </form>
                </div>
            )}

            {/* Result Slip View */}
            {results && (
                <div className="max-w-3xl mx-auto">
                    <div className="mb-4 flex justify-end items-center no-print gap-4">
                        <button onClick={() => setResults(null)} className="text-gray-500 hover:text-black">
                             Check Another
                        </button>
                        <button onClick={handlePrint} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700">
                            <div className="icon-printer"></div> Print Result Slip
                        </button>
                    </div>

                    <div className="bg-white p-10 rounded shadow-none border-2 border-gray-900 result-slip relative overflow-hidden">
                        {/* Logo Watermark Full BG */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
                            <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-[70%] h-[70%] object-contain" />
                        </div>

                        {/* Header */}
                        <div className="border-b-4 border-gray-900 pb-6 mb-6 flex items-center gap-6 relative z-10">
                             <div className="w-24 h-24 flex-shrink-0">
                                <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">JR NAGARA ONLINE TEST</h1>
                                <p className="text-sm font-bold tracking-widest uppercase text-purple-800">Statement of Result - UTME PRACTICE</p>
                            </div>
                            <div className="text-right">
                                <div className="w-28 h-28 bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden rounded">
                                     {studentInfo && studentInfo.passport ? (
                                         <img src={studentInfo.passport} className="w-full h-full object-cover" />
                                     ) : (
                                         <span className="text-xs text-gray-400">Passport</span>
                                     )}
                                </div>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="grid grid-cols-2 gap-y-4 gap-x-12 mb-8 text-sm border-b-2 border-gray-200 pb-8">
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500 font-bold">Candidate Name</span>
                                <span className="font-bold uppercase">{studentInfo ? studentInfo.name : results[0].studentName}</span>
                            </div>
                             <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500 font-bold">Registration No</span>
                                <span className="font-mono font-bold text-lg">{results[0].studentId}</span>
                            </div>
                             <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500 font-bold">Examination</span>
                                <span className="font-bold">{results[0].testCode}</span>
                            </div>
                             <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500 font-bold">Date</span>
                                <span className="font-bold">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Scores Table */}
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-4 uppercase tracking-wide border-l-4 border-purple-600 pl-3">Performance Detail</h3>
                            <table className="w-full border-collapse border border-gray-900">
                                <thead className="bg-gray-900 text-white">
                                    <tr>
                                        <th className="p-3 text-left border border-gray-700">Subject</th>
                                        <th className="p-3 text-right border border-gray-700 w-32">Score Obtained</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r, i) => (
                                        <tr key={i} className="border-b border-gray-300">
                                            <td className="p-3 border-r border-gray-300 font-medium">{r.subject}</td>
                                            <td className="p-3 text-right font-mono font-bold">{r.score}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-purple-50">
                                        <td className="p-3 border-r border-purple-200 font-bold text-right uppercase">Aggregate Score</td>
                                        <td className="p-3 text-right font-bold text-xl">{results.reduce((acc, curr) => acc + curr.score, 0)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end mt-16 pt-8 border-t-2 border-gray-900 relative z-10">
                            <div className="text-xs text-gray-500">
                                <p>1. This result slip is generated electronically.</p>
                                <p>2. Any alteration renders this document invalid.</p>
                                <p>3. STRICTLY NO COPYING OR REMIXING ALLOWED.</p>
                                <p className="font-mono mt-2">ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
                            </div>
                            <div className="text-center flex flex-col items-center">
                                <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/dcdc53cf-300a-4a1e-9e12-6c79d91896af.jpeg" className="h-16 object-contain -mb-4" />
                                <div className="w-40 border-b border-gray-900 mb-1"></div>
                                <p className="text-xs font-bold uppercase">REGISTRAR</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ResultChecker />);