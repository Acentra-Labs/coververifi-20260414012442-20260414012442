import React, { createContext, useState, useCallback } from 'react';
import {
  subcontractors,
  generalContractors,
  gcSubcontractors,
  insurancePolicies,
  insuranceAgents,
  documents,
  getGCsByConsultant,
  getSubsByGC,
  getPoliciesBySub,
  getAllActionItems,
  getPortfolioStats
} from '../data/mockData';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [subs, setSubs] = useState(subcontractors);
  const [gcs, setGCs] = useState(generalContractors);
  const [gcSubs, setGcSubs] = useState(gcSubcontractors);
  const [policies, setPolicies] = useState(insurancePolicies);
  const [agents, setAgents] = useState(insuranceAgents);
  const [docs, setDocs] = useState(documents);

  // Get all GCs for a consultant
  const getConsultantGCs = useCallback((consultantId) => {
    return gcs.filter(gc => gc.consultantId === consultantId);
  }, [gcs]);

  // Get all subs for a GC
  const getGCSubcontractors = useCallback((gcId) => {
    return gcSubs
      .filter(link => link.gcId === gcId)
      .map(link => {
        const sub = subs.find(s => s.id === link.subId);
        return sub ? { ...sub, linkId: link.id } : null;
      })
      .filter(Boolean);
  }, [gcSubs, subs]);

  // Get specific subcontractor
  const getSubcontractor = useCallback((subId) => {
    return subs.find(s => s.id === subId);
  }, [subs]);

  // Get specific GC
  const getGeneralContractor = useCallback((gcId) => {
    return gcs.find(g => g.id === gcId);
  }, [gcs]);

  // Get all policies for a subcontractor
  const getSubPolicies = useCallback((subId) => {
    return policies
      .filter(p => p.subId === subId)
      .map(p => ({
        ...p,
        agent: agents.find(a => a.id === p.agentId)
      }));
  }, [policies, agents]);

  // Get all action items for consultant
  const getActionItems = useCallback((consultantId) => {
    const consultantGCs = getConsultantGCs(consultantId);
    const items = [];

    consultantGCs.forEach(gc => {
      const gcSubs = getGCSubcontractors(gc.id);
      gcSubs.forEach(sub => {
        const subPolicies = getSubPolicies(sub.id);
        subPolicies.forEach(policy => {
          const daysLeft = Math.floor((new Date(policy.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
          let rag = 'green';

          if (daysLeft <= 0) rag = 'red';
          else if (daysLeft <= 30) rag = 'yellow';

          if (rag !== 'green') {
            items.push({
              id: `action-${policy.id}`,
              gcId: gc.id,
              gcName: gc.companyName,
              subId: sub.id,
              subName: sub.companyName,
              policyId: policy.id,
              policyType: policy.policyType,
              carrier: policy.carrier,
              expirationDate: policy.expirationDate,
              rag,
              daysLeft
            });
          }
        });
      });
    });

    return items.sort((a, b) => {
      if (a.rag === 'red' && b.rag !== 'red') return -1;
      if (a.rag !== 'red' && b.rag === 'red') return 1;
      return a.daysLeft - b.daysLeft;
    });
  }, [getConsultantGCs, getGCSubcontractors, getSubPolicies]);

  // Get portfolio stats
  const getStats = useCallback((consultantId) => {
    const consultantGCs = getConsultantGCs(consultantId);
    const allSubs = [];
    let compliantCount = 0;
    let expiringCount = 0;

    consultantGCs.forEach(gc => {
      const subs = getGCSubcontractors(gc.id);
      allSubs.push(...subs);
    });

    allSubs.forEach(sub => {
      const subPolicies = getSubPolicies(sub.id);
      let isCompliant = true;
      subPolicies.forEach(policy => {
        const daysLeft = Math.floor((new Date(policy.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 0) isCompliant = false;
        if (daysLeft > 0 && daysLeft <= 30) expiringCount++;
      });
      if (isCompliant) compliantCount++;
    });

    const compliancePercentage = allSubs.length > 0
      ? Math.round((compliantCount / allSubs.length) * 100)
      : 0;

    return {
      totalGCs: consultantGCs.length,
      totalSubs: allSubs.length,
      compliantSubs: compliantCount,
      expiringThisMonth: expiringCount,
      compliancePercentage
    };
  }, [getConsultantGCs, getGCSubcontractors, getSubPolicies]);

  // Add subcontractor
  const addSubcontractor = useCallback((subData) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      ...subData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSubs(prev => [...prev, newSub]);
    return newSub;
  }, []);

  // Add GC
  const addGeneralContractor = useCallback((gcData) => {
    const newGC = {
      id: `gc-${Date.now()}`,
      ...gcData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setGCs(prev => [...prev, newGC]);
    return newGC;
  }, []);

  // Link sub to GC
  const linkSubToGC = useCallback((gcId, subId) => {
    const newLink = {
      id: `gc-sub-${Date.now()}`,
      gcId,
      subId,
      createdAt: new Date().toISOString()
    };
    setGcSubs(prev => [...prev, newLink]);
    return newLink;
  }, []);

  // Add policy
  const addPolicy = useCallback((policyData) => {
    const newPolicy = {
      id: `policy-${Date.now()}`,
      ...policyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPolicies(prev => [...prev, newPolicy]);
    return newPolicy;
  }, []);

  // Add agent
  const addAgent = useCallback((agentData) => {
    const newAgent = {
      id: `agent-${Date.now()}`,
      ...agentData,
      createdAt: new Date().toISOString()
    };
    setAgents(prev => [...prev, newAgent]);
    return newAgent;
  }, []);

  // Update policy
  const updatePolicy = useCallback((policyId, updates) => {
    setPolicies(prev =>
      prev.map(p =>
        p.id === policyId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
  }, []);

  const value = {
    // Data
    subs,
    gcs,
    gcSubs,
    policies,
    agents,
    docs,
    // Get methods
    getConsultantGCs,
    getGCSubcontractors,
    getSubcontractor,
    getGeneralContractor,
    getSubPolicies,
    getActionItems,
    getStats,
    // Add/Update methods
    addSubcontractor,
    addGeneralContractor,
    linkSubToGC,
    addPolicy,
    addAgent,
    updatePolicy
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
