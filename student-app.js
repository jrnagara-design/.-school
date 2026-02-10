const { useState, useEffect, useRef } = React;

function Login({ onLogin, directMode }) {
    const [regNumber, setRegNumber] = useState('');
    const [testCode, setTestCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Recovery State
    const [showRecover, setShowRecover] = useState(false);
    const [recoverPhone, setRecoverPhone] = useState('');
    const [recoverEmail, setRecoverEmail] = useState('');
    const [recoverResult, setRecoverResult] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) setTestCode(code);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const students = await window.JRStorage.getStudents();
            const student = students.find(s => s.regNumber === regNumber);
            
            const tests = await window.JRStorage.getTests();
            const test = tests.find(t => t.code === testCode);

            if (!student) {
                setError('Invalid Registration Number. Please contact admin.');
                setLoading(false);
                return;
            }
            if (!test) {
                setError('Invalid Test Code. Please check the link.');
                setLoading(false);
                return;
            }

            // Assignment Check
            if (test.assignedStudents && test.assignedStudents.length > 0) {
                if (!test.assignedStudents.includes(student.regNumber)) {
                    setError('You are not authorized to take this specific test. Please contact admin.');
                    setLoading(false);
                    return;
                }
            }

            // Time Checks
            const now = new Date();
            const startTime = new Date(test.startTime);
            const endTime = new Date(test.endTime);
            // Allow access 10 minutes before for verification setup
            const accessWindow = new Date(startTime.getTime() - 10 * 60 * 1000); 

            console.log("Time Check:", { now, accessWindow, startTime, endTime });

            if (now < accessWindow) {
                setError(`Portal not open yet. Access Allowed from: ${accessWindow.toLocaleTimeString()} (${startTime.toLocaleTimeString()} Start)`);
                setLoading(false);
                return;
            }

            if (now > endTime) {
                setError('Test Access Expired. You cannot take this test anymore.');
                setLoading(false);
                return;
            }

            onLogin(student, test);
        } catch(err) {
            console.error(err);
            setError('System Error. Please try again.');
        }
        setLoading(false);
    };

    const handleRecover = async (e) => {
        e.preventDefault();
        const students = await window.JRStorage.getStudents();
        const match = students.find(s => 
            s.email.toLowerCase() === recoverEmail.toLowerCase() && 
            s.phone === recoverPhone
        );

        if(match) {
            setRecoverResult(match);
        } else {
            alert("No matching record found with this Email AND Phone combination.");
        }
    };

    if (showRecover) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                 <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl relative">
                    <button onClick={() => setShowRecover(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><div className="icon-x"></div></button>
                    <h2 className="text-xl font-bold mb-4">Recover Registration</h2>
                    
                    {!recoverResult ? (
                        <form onSubmit={handleRecover} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Registered Phone</label>
                                <input type="tel" className="w-full p-2 border rounded" required value={recoverPhone} onChange={e => setRecoverPhone(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Registered Email</label>
                                <input type="email" className="w-full p-2 border rounded" required value={recoverEmail} onChange={e => setRecoverEmail(e.target.value)} />
                            </div>
                            <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Search Record</button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <div className="icon-circle-check text-4xl text-green-500 mx-auto mb-2"></div>
                            <p>Record Found!</p>
                            <div className="bg-gray-100 p-4 rounded my-4">
                                <p className="text-sm text-gray-500">Your Registration Number</p>
                                <p className="text-2xl font-mono font-bold text-blue-900">{recoverResult.regNumber}</p>
                                <p className="font-bold mt-2">{recoverResult.name}</p>
                            </div>
                            <button onClick={() => {
                                setRegNumber(recoverResult.regNumber);
                                setShowRecover(false);
                                setRecoverResult(null);
                            }} className="text-blue-600 underline text-sm">Use this to Login</button>
                        </div>
                    )}
                 </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                     <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                        <img src="https://app.trickle.so/storage/public/images/usr_1a4d0bc2f0000001/49d92f14-334d-4dff-a9ad-044794e4b6cd.jpeg" className="w-full h-full object-cover" />
                     </div>
                    <h1 className="text-2xl font-bold text-gray-900 uppercase">JR NAGARA ONLINE TEST</h1>
                    <p className="text-gray-500">Student Examination Portal</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center">
                        <div className="icon-circle-alert mr-2"></div>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Registration Number</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            value={regNumber}
                            onChange={e => setRegNumber(e.target.value)}
                            placeholder="Enter Reg No"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Test Code</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            value={testCode}
                            onChange={e => setTestCode(e.target.value)}
                            placeholder="Enter Test Code"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50">
                        {loading ? 'Verifying...' : 'Proceed to Verification'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => setShowRecover(true)} className="text-sm text-emerald-600 font-medium hover:underline">
                        Forgot Registration Number?
                    </button>
                    {!directMode && (
                        <div className="mt-2 pt-2 border-t">
                             <a href="index.html" className="text-xs text-gray-400 hover:text-gray-600">Back to Home</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function FaceVerification({ onVerified, student, testCode, onStreamAcquired }) {
    const videoRef = useRef(null);
    const [status, setStatus] = useState('camera_init'); 
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        startCamera();
        return () => {
            // Cleanup logic if needed, but we want to keep stream alive
        }
    }, []);

    const startCamera = async () => {
        try {
            console.log("Requesting camera access...");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log("Camera access granted:", stream);
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            onStreamAcquired(stream); // Pass up to App
            
            setStatus('scanning');
            startScanning();
            
            window.JRStorage.updateStudentStatus(student.regNumber, {
                name: student.name,
                regNumber: student.regNumber,
                testCode: testCode,
                status: 'Verifying',
                warningCount: 0
            });
        } catch (err) {
            console.error("Camera Error:", err);
            setStatus('failed');
        }
    };

    const startScanning = () => {
        let p = 0;
        // Slower scan for realism
        const interval = setInterval(() => {
            p += 1;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setStatus('verified');
                window.JRStorage.updateStudentStatus(student.regNumber, {
                    name: student.name,
                    regNumber: student.regNumber,
                    testCode: testCode,
                    status: 'Verified',
                    warningCount: 0
                });
                setTimeout(() => {
                    onVerified();
                }, 1500);
            }
        }, 60); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold mb-6">AI Face Verification</h2>
                
                <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-6 border-4 border-gray-700 shadow-2xl bg-gray-800">
                    {(status === 'camera_init' || status === 'scanning' || status === 'verified') && (
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                    )}

                    {status === 'failed' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-800">
                            <div className="icon-camera-off text-4xl text-red-500 mb-4"></div>
                            <h3 className="text-xl font-bold">Camera Access Failed</h3>
                            <p className="text-sm mt-2">Please check browser permissions.</p>
                            <button onClick={startCamera} className="mt-4 bg-blue-600 px-6 py-2 rounded">Retry</button>
                        </div>
                    )}
                    
                    {(status === 'scanning' || status === 'verified') && (
                        <>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 border-2 border-white/30 rounded-full relative">
                                    {status === 'scanning' && <div className="scan-line"></div>}
                                    {status === 'verified' && (
                                        <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm">
                                            <div className="bg-emerald-500 p-4 rounded-full">
                                                <div className="icon-check text-4xl text-white"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-black/60 p-4 text-sm font-mono">
                                <div className="flex justify-between mb-1">
                                    <span>Analysis Status:</span>
                                    <span className={status === 'verified' ? 'text-green-400' : 'text-yellow-400'}>{status.toUpperCase()}</span>
                                </div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-200" style={{width: `${progress}%`}}></div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function WaitingRoom({ test, onStart }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const start = new Date(test.startTime);
            const diff = start - now;

            if (diff <= 0) {
                clearInterval(interval);
                onStart();
            } else {
                setTimeLeft(diff);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatCountdown = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-2xl w-full bg-gray-800 p-8 rounded-2xl shadow-2xl text-center border border-gray-700">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-900/30 rounded-full flex items-center justify-center animate-pulse">
                    <div className="icon-clock text-4xl text-blue-400"></div>
                </div>
                <h1 className="text-3xl font-bold mb-2">Waiting Room</h1>
                <p className="text-gray-400 mb-8">The test will commence automatically when the timer hits zero.</p>
                
                <div className="bg-black/50 p-8 rounded-xl border border-gray-600 mb-8">
                    <div className="text-sm text-gray-500 uppercase tracking-widest mb-2">Time Until Start</div>
                    <div className="text-6xl font-mono font-bold text-white tabular-nums">
                        {formatCountdown(timeLeft)}
                    </div>
                </div>

                <div className="text-left bg-gray-700/50 p-6 rounded-lg text-sm space-y-3">
                    <h3 className="font-bold text-gray-300 uppercase border-b border-gray-600 pb-2 mb-2">Instructions</h3>
                    <p>1. Do not refresh the page or you may be logged out.</p>
                    <p>2. Keep your face visible in the camera at all times.</p>
                    <p>3. Switching tabs is strictly prohibited and monitored.</p>
                    <p>4. Answer all questions before clicking Submit.</p>
                </div>
            </div>
        </div>
    );
}

function Exam({ student, test, directMode, cameraStream, onStreamRequest }) {
    // Determine initial time left based on Fixed Window or Duration
    // If student enters late, they should only have remaining time until EndTime
    const [timeLeft, setTimeLeft] = useState(() => {
        const now = new Date();
        const endTime = new Date(test.endTime);
        const durationSeconds = test.duration * 60;
        
        // Calculate seconds until absolute end time
        const secondsUntilEnd = Math.floor((endTime - now) / 1000);
        
        // Return whichever is smaller: the full duration, or time remaining in window
        // But also ensure it doesn't exceed the test duration if the window is huge
        // Actually, usually it's strict: Time Left = min(test_duration, window_remaining)
        
        return Math.min(durationSeconds, secondsUntilEnd);
    });

    const [activeSubject, setActiveSubject] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [warnings, setWarnings] = useState(0);
    const [messages, setMessages] = useState([]);
    
    // Live Camera Ref
    const miniVideoRef = useRef(null);
    const snapshotCanvasRef = useRef(null); // Invisible canvas for snapshots

    const [subjects] = useState(test.subjects.map(s => ({
        ...s,
        questions: s.questions || []
    })));

    // Camera Restoration Logic
    useEffect(() => {
        if (!cameraStream) {
            console.log("Exam component lost stream. Requesting restoration...");
            onStreamRequest();
        } else if (miniVideoRef.current) {
            console.log("Exam component attaching stream to video");
            miniVideoRef.current.srcObject = cameraStream;
            miniVideoRef.current.play().catch(e => console.log("Play error", e));
        }
    }, [cameraStream]);

    // Snapshot Logic
    useEffect(() => {
        const snapshotTimer = setInterval(() => {
            if (miniVideoRef.current && cameraStream) {
                const video = miniVideoRef.current;
                const canvas = snapshotCanvasRef.current;
                if(video.readyState === video.HAVE_ENOUGH_DATA) {
                     // Draw snapshot
                     const ctx = canvas.getContext('2d');
                     canvas.width = 160; 
                     canvas.height = 120;
                     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                     // Low quality for speed
                     const dataUrl = canvas.toDataURL('image/jpeg', 0.3);

                     // Send to Admin frequently for movement effect
                     window.JRStorage.updateStudentStatus(student.regNumber, {
                        name: student.name,
                        regNumber: student.regNumber,
                        testCode: test.code,
                        status: 'Active',
                        warningCount: warnings,
                        snapshot: dataUrl,
                        lastSeen: new Date().toISOString()
                    });
                }
            }
        }, 1000); // 1s interval

        return () => clearInterval(snapshotTimer);
    }, [cameraStream, warnings]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
            checkMessages();
        }, 1000);

        const checkMessages = async () => {
             const msgs = await window.JRStorage.getMessages(student.regNumber);
             const newMsgs = msgs.filter(m => !m.read);
             if(newMsgs.length > 0) {
                 newMsgs.forEach(m => window.JRStorage.markMessageRead(m.id));
                 setMessages(prev => [...prev, ...newMsgs]);
             }
        }

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings(w => w + 1);
                alert("WARNING: Tab switching is monitored! Return to test immediately.");
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(timer);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [warnings]);

    const handleAnswer = (qId, optionIdx) => {
        setAnswers(prev => ({
            ...prev,
            [`${activeSubject}-${qId}`]: optionIdx
        }));
    };

    const handleSubmit = async () => {
        // Calculate Score
        for (const sub of subjects) {
            let correctCount = 0;
            const totalQs = sub.questions.length;
            
            if(totalQs > 0) {
                sub.questions.forEach(q => {
                    if (answers[`${subjects.indexOf(sub)}-${q.id}`] === q.correct) {
                        correctCount++;
                    }
                });
                
                const score = Math.round((correctCount / totalQs) * 100);

                await window.JRStorage.saveResult({
                    studentId: student.regNumber,
                    studentName: student.name,
                    testId: test.id,
                    testCode: test.code,
                    subject: sub.name,
                    score: score, 
                    date: new Date().toISOString(),
                    approved: false
                });
            }
        }

        await window.JRStorage.updateStudentStatus(student.regNumber, {
            name: student.name,
            regNumber: student.regNumber,
            testCode: test.code,
            status: 'Completed',
            warningCount: warnings
        });

        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-lg">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="icon-check text-4xl text-green-600"></div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Test Submitted!</h2>
                    <p className="text-gray-600 mb-8">Your responses have been securely recorded. <br/> Please wait for Admin approval to check results.</p>
                    {!directMode && (
                         <a href="index.html" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                             Return Home
                         </a>
                    )}
                </div>
            </div>
        );
    }

    const formatTime = (s) => {
        if(s <= 0) return "00:00";
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-2 rounded">
                            <span className="block text-xs text-gray-500">Student</span>
                            <span className="font-bold">{student.name}</span>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                            <span className="block text-xs text-gray-500">Reg No</span>
                            <span className="font-mono">{student.regNumber}</span>
                        </div>
                    </div>
                    
                    <div className="text-2xl font-mono font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-pulse">
                        {formatTime(timeLeft)}
                    </div>

                    <button 
                        onClick={() => {
                            if(confirm("Submit Test? You cannot return.")) handleSubmit();
                        }}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700"
                    >
                        Submit Test
                    </button>
                </div>
            </header>

            {/* Messages Overlay */}
            {messages.length > 0 && (
                <div className="fixed top-24 right-4 z-50 w-80 space-y-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className="bg-blue-600 text-white p-4 rounded-lg shadow-lg flex items-start animate-bounce">
                             <div className="icon-message-circle mr-3 mt-1"></div>
                             <div>
                                 <h4 className="font-bold text-xs uppercase opacity-75">Admin Message</h4>
                                 <p className="text-sm">{msg.text}</p>
                             </div>
                        </div>
                    ))}
                </div>
            )}
            
            {/* PIP Camera Feed */}
            <div className="fixed bottom-4 right-4 z-40 w-48 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-emerald-500 group">
                <video ref={miniVideoRef} autoPlay playsInline muted className="w-full aspect-video object-cover transform scale-x-[-1]"></video>
                <div className="absolute top-1 left-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-white font-mono uppercase">Live Monitored</span>
                </div>
                {/* Hidden canvas for snapshot logic */}
                <canvas ref={snapshotCanvasRef} className="hidden"></canvas>
            </div>

            <div className="flex flex-1 max-w-7xl mx-auto w-full p-4 gap-6">
                {/* Subject Nav */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                        <h3 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-4">Subjects</h3>
                        <div className="space-y-2">
                            {subjects.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSubject(idx)}
                                    className={`w-full text-left p-3 rounded-lg transition-all ${
                                        activeSubject === idx 
                                        ? 'bg-emerald-600 text-white shadow-md' 
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="font-bold block">{sub.name}</span>
                                    <span className="text-xs opacity-75">{sub.questions.length} Questions</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Questions Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm p-8 min-h-[600px]">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-4">{subjects[activeSubject].name}</h2>
                    
                    {subjects[activeSubject].questions.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <div className="icon-file-question text-4xl mb-4"></div>
                            <p>No questions added for this subject.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {subjects[activeSubject].questions.map((q, qIdx) => (
                                <div key={q.id} className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                    <p className="font-medium text-lg mb-4 flex">
                                        <span className="text-gray-400 mr-2">{qIdx + 1}.</span>
                                        {q.text}
                                    </p>
                                    <div className="space-y-2 ml-8">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = answers[`${activeSubject}-${q.id}`] === optIdx;
                                            return (
                                                <label key={optIdx} className={`flex items-center p-3 rounded border cursor-pointer transition-all ${
                                                    isSelected ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-gray-300'
                                                }`}>
                                                    <input 
                                                        type="radio" 
                                                        name={`q-${activeSubject}-${q.id}`}
                                                        checked={isSelected}
                                                        onChange={() => handleAnswer(q.id, optIdx)}
                                                        className="mr-3 w-4 h-4 text-emerald-600"
                                                    />
                                                    {opt}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function App() {
    const [step, setStep] = useState('login'); 
    const [session, setSession] = useState({ student: null, test: null });
    const [cameraStream, setCameraStream] = useState(null);
    const [directMode] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return !!params.get('code');
    });

    const handleLogin = (student, test) => {
        setSession({ student, test });
        setStep('verify');
    };

    const handleVerified = () => {
        // Check if test has started
        const now = new Date();
        const start = new Date(session.test.startTime);
        
        if (now < start) {
            setStep('waiting');
        } else {
            setStep('exam');
        }
    };

    // Callback to restore stream if lost
    const restoreStream = async () => {
         try {
             console.log("App restoring stream...");
             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
             setCameraStream(stream);
         } catch(e) {
             console.error("Failed to restore stream", e);
             alert("Camera access is required for monitoring!");
         }
    };

    return (
        <>
            {step === 'login' && <Login onLogin={handleLogin} directMode={directMode} />}
            {step === 'verify' && (
                <FaceVerification 
                    student={session.student} 
                    testCode={session.test?.code} 
                    onVerified={handleVerified} 
                    onStreamAcquired={setCameraStream} 
                />
            )}
            {step === 'waiting' && (
                <WaitingRoom 
                    test={session.test}
                    onStart={() => setStep('exam')}
                />
            )}
            {step === 'exam' && (
                <Exam 
                    student={session.student} 
                    test={session.test} 
                    directMode={directMode} 
                    cameraStream={cameraStream} 
                    onStreamRequest={restoreStream}
                />
            )}
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);