'use client';

import { useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface ContractTemplate {
  id: string;
  title: string;
  body: string;
}

interface SignedContract {
  id: string;
  templateId: string;
  templateTitle: string;
  signerName: string;
  signerEmail: string;
  signature: string;
  signedAt: string;
}

export default function Contracts() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [signedContracts, setSignedContracts] = useState<SignedContract[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ContractTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'sign'>('templates');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signaturePad, setSignaturePad] = useState<SignaturePad | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    const savedTemplates = localStorage.getItem('contractTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      const mockTemplate: ContractTemplate = {
        id: '1',
        title: 'Remodel Contract',
        body: 'This contract is for the remodeling of the property located at 123 Main St. The work includes kitchen renovation, bathroom updates, and new flooring. The total cost is $50,000, with a 50% deposit required upon signing. The project is expected to be completed within 3 months.',
      };
      setTemplates([mockTemplate]);
      localStorage.setItem('contractTemplates', JSON.stringify([mockTemplate]));
    }
    const savedSignedContracts = localStorage.getItem('signedContracts');
    if (savedSignedContracts) {
      setSignedContracts(JSON.parse(savedSignedContracts));
    }
  }, []);

  const saveTemplates = (updatedTemplates: ContractTemplate[]) => {
    localStorage.setItem('contractTemplates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const addTemplate = () => {
    if (!newTitle || !newBody) return;
    const newTemplate: ContractTemplate = {
      id: Date.now().toString(),
      title: newTitle,
      body: newBody,
    };
    saveTemplates([...templates, newTemplate]);
    setNewTitle('');
    setNewBody('');
    setIsModalOpen(false);
  };

  const deleteTemplate = (id: string) => {
    saveTemplates(templates.filter(t => t.id !== id));
  };

  const startEdit = (template: ContractTemplate) => {
    setEditingId(template.id);
    setNewTitle(template.title);
    setNewBody(template.body);
    setIsModalOpen(true);
  };

  const saveEdit = () => {
    if (!editingId || !newTitle || !newBody) return;
    const updatedTemplates = templates.map(t =>
      t.id === editingId ? { ...t, title: newTitle, body: newBody } : t
    );
    saveTemplates(updatedTemplates);
    setEditingId(null);
    setNewTitle('');
    setNewBody('');
    setIsModalOpen(false);
  };

  const handlePreview = (template: ContractTemplate) => {
    setPreviewTemplate(template);
  };

  const signContract = () => {
    if (!selectedTemplateId || !signerName || !signerEmail || !signaturePad) return;
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;
    const signature = signaturePad.toDataURL();
    const newSignedContract: SignedContract = {
      id: Date.now().toString(),
      templateId: selectedTemplateId,
      templateTitle: template.title,
      signerName,
      signerEmail,
      signature,
      signedAt: new Date().toISOString(),
    };
    const updatedSignedContracts = [...signedContracts, newSignedContract];
    localStorage.setItem('signedContracts', JSON.stringify(updatedSignedContracts));
    setSignedContracts(updatedSignedContracts);
    setSelectedTemplateId('');
    setSignerName('');
    setSignerEmail('');
    signaturePad.clear();
  };

  const mockTemplate: ContractTemplate = {
    id: '1',
    title: 'Remodel Contract',
    body: 'This contract is for the remodeling of the property located at 123 Main St. The work includes kitchen renovation, bathroom updates, and new flooring. The total cost is $50,000, with a 50% deposit required upon signing. The project is expected to be completed within 3 months.',
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <main className="flex-1 container py-16">
        <h1 className="text-2xl font-bold mb-4">Contracts</h1>
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('templates')}
            className={`p-2 ${activeTab === 'templates' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`p-2 ${activeTab === 'sign' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Sign Contract
          </button>
        </div>
        {activeTab === 'templates' ? (
          <>
            <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white p-2 rounded mb-4">Add New Template</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="p-4 border rounded shadow">
                  <h3 className="font-bold">{template.title}</h3>
                  <p>{template.body}</p>
                  <button onClick={() => startEdit(template)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
                  <button onClick={() => deleteTemplate(template.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                  <button onClick={() => handlePreview(template)} className="bg-gray-500 text-white p-1 rounded ml-2">Preview</button>
                </div>
              ))}
            </div>
            {previewTemplate && (
              <div className="mt-4 p-4 border rounded shadow">
                <h2 className="text-xl font-bold">Preview</h2>
                <h3 className="font-bold">{previewTemplate.title}</h3>
                <p>{previewTemplate.body}</p>
                <button onClick={() => setPreviewTemplate(null)} className="bg-gray-500 text-white p-1 rounded">Close Preview</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-2xl mb-6">
              <label className="font-bold mb-2 block">Upload Files</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="mb-2"
              />
              {uploadedFiles.length > 0 && (
                <ul className="mb-4 text-sm text-gray-700">
                  {uploadedFiles.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="border p-2 mr-2 mb-4"
              style={{ minWidth: 250 }}
            >
              <option value="">Select a Template</option>
              <option value={mockTemplate.id}>{mockTemplate.title}</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>{template.title}</option>
              ))}
            </select>
            {selectedTemplateId === mockTemplate.id && (
              <div className="bg-white text-black shadow-lg rounded p-8 w-full max-w-2xl border mb-6" style={{ minHeight: '600px' }}>
                <h2 className="text-2xl font-bold mb-2 text-center">Remodel Contract</h2>
                <p className="mb-4 text-sm text-center text-gray-500">Contract #RM-2024-001</p>
                <div className="prose max-w-none">
                  <p>This contract is made between <b>Homeowner</b> and <b>Remodeling Contractor</b> for the remodeling of the property located at <b>123 Main St</b>.</p>
                  <h3 className="font-bold mt-4">Scope of Work</h3>
                  <ul className="list-disc ml-6">
                    <li>Kitchen renovation</li>
                    <li>Bathroom updates</li>
                    <li>New flooring throughout the house</li>
                  </ul>
                  <h3 className="font-bold mt-4">Payment Terms</h3>
                  <ul className="list-disc ml-6">
                    <li>Total cost: <b>$50,000</b></li>
                    <li>Deposit required upon signing: <b>50%</b></li>
                    <li>Balance due upon completion</li>
                  </ul>
                  <h3 className="font-bold mt-4">Timeline</h3>
                  <ul className="list-disc ml-6">
                    <li>Estimated start date: <b>July 1, 2024</b></li>
                    <li>Estimated completion: <b>3 months from start</b></li>
                  </ul>
                  <h3 className="font-bold mt-4">Signatures</h3>
                  <p>By signing below, both parties agree to the terms outlined above.</p>
                </div>
              </div>
            )}
            {selectedTemplateId && selectedTemplateId !== mockTemplate.id && (
              <div className="bg-white text-black shadow-lg rounded p-8 w-full max-w-2xl border mb-6" style={{ minHeight: '400px' }}>
                <h3 className="text-xl font-bold mb-2">{templates.find(t => t.id === selectedTemplateId)?.title}</h3>
                <p>{templates.find(t => t.id === selectedTemplateId)?.body}</p>
              </div>
            )}
            {selectedTemplateId && (
              <div className="w-full max-w-2xl flex flex-col items-center mt-2">
                <label className="font-bold mb-2 self-start">Signer Name</label>
                <input
                  type="text"
                  placeholder="Signer Name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="border p-2 mb-2 w-full"
                />
                <label className="font-bold mb-2 self-start">Signer Email</label>
                <input
                  type="email"
                  placeholder="Signer Email"
                  value={signerEmail}
                  onChange={(e) => setSignerEmail(e.target.value)}
                  className="border p-2 mb-2 w-full"
                />
                <label className="font-bold mb-2 self-start">Signature</label>
                <div className="bg-gray-100 border rounded mb-2 flex items-center justify-center" style={{ width: 320, height: 120 }}>
                  <SignaturePad
                    ref={(ref: SignaturePad) => setSignaturePad(ref)}
                    canvasProps={{ width: 300, height: 100, className: 'bg-white' }}
                  />
                </div>
                <button onClick={signContract} className="bg-green-500 text-white p-2 rounded w-full">Sign Contract</button>
              </div>
            )}
            <h2 className="text-xl font-bold mt-4">Signed Contracts</h2>
            <ul>
              {signedContracts.map((contract) => (
                <li key={contract.id} className="mb-2 p-2 border">
                  <h3 className="font-bold">{contract.templateTitle}</h3>
                  <p>Signed by: {contract.signerName} ({contract.signerEmail})</p>
                  <p>Signed at: {new Date(contract.signedAt).toLocaleString()}</p>
                  <img src={contract.signature} alt="Signature" className="mt-2" />
                </li>
              ))}
            </ul>
          </div>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Template' : 'Add New Template'}</h2>
              <input
                type="text"
                placeholder="Template Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border p-2 mb-2 w-full"
              />
              <textarea
                placeholder="Template Body"
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="border p-2 mb-2 w-full"
              />
              {editingId ? (
                <button onClick={saveEdit} className="bg-blue-500 text-white p-2 rounded">Save Edit</button>
              ) : (
                <button onClick={addTemplate} className="bg-green-500 text-white p-2 rounded">Add Template</button>
              )}
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white p-2 rounded ml-2">Cancel</button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 