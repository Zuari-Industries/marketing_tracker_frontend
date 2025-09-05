import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Download, Upload, FileUp, FileText, CheckCircle, AlertTriangle } from 'lucide-react';


const API_BASE = import.meta.env.VITE_API_URL;

const DataImportExportPage = () => {
    const { tasks, importTasks,fetchTasks } = useAuth(); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState({ status: 'idle', message: '' }); 
    const fileInputRef = useRef(null);

    const handleDownloadTemplate = () => {
        const headers = "title,type,businessUnit,requester,dueDate,priority,status";
        const content = `${headers}\n"New Q4 Campaign","Campaign","Snackpure","John Doe","2025-12-01","High","Not Started"`;
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "import_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportData = () => {
        window.open(`${API_BASE}/api/requests/export', '_blank`);
    };

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setUploadStatus({ status: 'idle', message: '' });
        }
    };
const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }
        setUploadStatus({ status: 'loading', message: 'Importing tasks...' });

        try {
            const result = await importTasks(selectedFile);
            setUploadStatus({ status: 'success', message: result.message });
            setSelectedFile(null); 
        } catch (error) {
            setUploadStatus({ status: 'error', message: error.message });
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Data Import & Export</h2>
                <p className="text-gray-400">Import work requests from CSV files and export reports.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Data Import</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-md text-center">
                            <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                            <h4 className="font-semibold text-white">Download Template</h4>
                            <button onClick={handleDownloadTemplate} className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm">
                                <Download size={16} /> Download
                            </button>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-md text-center">
                            <FileUp size={32} className="mx-auto text-gray-400 mb-2" />
                            <h4 className="font-semibold text-white">Upload Data</h4>
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".csv" className="hidden" />
                            <button onClick={() => fileInputRef.current.click()} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold">
    <Upload size={16} /> Choose File
</button>
                        </div>
                    </div>
                    {selectedFile && (
                        <div className="mt-4">
                            <p className="text-center text-sm text-gray-400 mb-2">Selected file: <strong>{selectedFile.name}</strong></p>
                            <button onClick={handleUpload} disabled={uploadStatus.status === 'loading'} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold disabled:bg-green-800 disabled:cursor-not-allowed">
                                {uploadStatus.status === 'loading' ? 'Importing...' : 'Confirm and Import'}
                            </button>
                        </div>
                    )}
                    {uploadStatus.status === 'success' && <div className="mt-4 text-center text-sm text-green-400 flex items-center justify-center gap-2"><CheckCircle size={16}/> {uploadStatus.message}</div>}
                    {uploadStatus.status === 'error' && <div className="mt-4 text-center text-sm text-red-400 flex items-center justify-center gap-2"><AlertTriangle size={16}/> {uploadStatus.message}</div>}
                </div>
                 {selectedFile && (
                        <div className="mt-4">
                            <p className="text-center text-sm text-gray-400 mb-2">Selected file: <strong>{selectedFile.name}</strong></p>
                            <button onClick={handleUpload} disabled={uploadStatus.status === 'loading'} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold disabled:bg-green-800 disabled:cursor-not-allowed">
                                {uploadStatus.status === 'loading' ? 'Importing...' : 'Confirm and Import'}
                            </button>
                        </div>
                    )}
                    {uploadStatus.status === 'success' && <div className="mt-4 text-center text-sm text-green-400 flex items-center justify-center gap-2"><CheckCircle size={16}/> {uploadStatus.message}</div>}
                    {uploadStatus.status === 'error' && <div className="mt-4 text-center text-sm text-red-400 flex items-center justify-center gap-2"><AlertTriangle size={16}/> {uploadStatus.message}</div>}


                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Data Export</h3>
                     <button onClick={handleExportData} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">
                        <Download size={16} /> Export All Data as CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataImportExportPage;