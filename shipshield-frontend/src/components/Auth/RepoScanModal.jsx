import React from 'react';
import Modal from '../ui/Modal';
import RepoInput from '../ui/RepoInput';
import { useNavigate } from 'react-router-dom';

const RepoScanModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleScan = (url) => {
        // In a real app, we might validate the URL or start a scan process here.
        // For now, we simulate success and go to dashboard/scan.
        console.log("Scanning repo: ", url);
        onClose();
        navigate('/Scan');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Connect Repository">
            <div className="flex flex-col gap-4">
                <p className="text-gray-600 text-sm">
                    Enter the URL of the GitHub repository you want to scan for vulnerabilities and readiness.
                </p>
                <RepoInput
                    theme="light"
                    onSubmit={handleScan}
                    className="w-full shadow-sm"
                />
                <div className="mt-2 text-xs text-gray-400 text-center">
                    Supported: Public and Private (with token) GitHub repositories.
                </div>
            </div>
        </Modal>
    );
};

export default RepoScanModal;
