import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import MainLayout from '../components/layout/MainLayout';
import { Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GCListPage() {
  const { user } = useAuth();
  const { getConsultantGCs, gcs, getGCSubcontractors } = useData();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactEmail: '',
    contactPhone: ''
  });

  const consultantGCs = useMemo(
    () => getConsultantGCs(user?.id || user?.consultantId),
    [user, getConsultantGCs]
  );

  const handleAddGC = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactEmail) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('General Contractor added successfully');
    setFormData({ companyName: '', contactEmail: '', contactPhone: '' });
    setShowAddModal(false);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">General Contractors</h2>
            <p className="text-slate-600 mt-1">Manage your contractor clients and their subcontractors</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Contractor
          </button>
        </div>

        {/* GC Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultantGCs.map(gc => {
            const subCount = getGCSubcontractors(gc.id).length;
            return (
              <div
                key={gc.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">{gc.companyName}</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={18} className="text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${gc.contactEmail}`} className="text-sm text-blue-600 hover:underline">
                        {gc.contactEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Phone size={18} className="text-slate-400 flex-shrink-0" />
                      <a href={`tel:${gc.contactPhone}`} className="text-sm text-blue-600 hover:underline">
                        {gc.contactPhone}
                      </a>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <p className="text-2xl font-bold text-slate-900">{subCount}</p>
                    <p className="text-sm text-slate-600">Active Subcontractors</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/gcs/${gc.id}`)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {consultantGCs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No contractors added yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Add Your First Contractor
            </button>
          </div>
        )}

        {/* Add GC Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Add General Contractor</h3>

              <form onSubmit={handleAddGC} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ABC Construction"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="208-555-1234"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Contractor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
