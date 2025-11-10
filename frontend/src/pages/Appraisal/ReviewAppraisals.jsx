import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import api from "../../services/api";

import RmReviewList from "../../components/AppraisalListComponents/RmReviewList";
import HrReviewList from "../../components/AppraisalListComponents/HrReviewList";
import HodReviewList from "../../components/AppraisalListComponents/HodReviewList";
import CooReviewList from "../../components/AppraisalListComponents/CooReviewList";
import CeoReviewList from "../../components/AppraisalListComponents/CeoReviewList";

const ReviewAppraisals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("");
  const [reviewPermissions, setReviewPermissions] = useState({});


  const TABS = [
    { key: "RM Review", perm: "EmployeeRmReview", component: RmReviewList },
    { key: "HR Review", perm: "EmployeeHrReview", component: HrReviewList },
    { key: "HOD Review", perm: "EmployeeHodReview", component: HodReviewList },
    { key: "COO Review", perm: "EmployeeCooReview", component: CooReviewList },
    { key: "CEO Review", perm: "EmployeeCeoReview", component: CeoReviewList },
  ];


  // Fetch permissions
  useEffect(() => {
    const fetchRolePermissions = async () => {
      try {
        const res = await api.get(
          `system/role-permissions/${user.role}/${"ReviewAppraisal"}/`
        );

        const list = Array.isArray(res.data)
          ? res.data
          : res.data
          ? [res.data]
          : [];

        const map = {};
        list.forEach((p) => (map[p.sub_workspace] = p));
        console.log("Review Appraisal role permissions:", map);
        setReviewPermissions(map);
      } catch (error) {
        console.warn("Error fetching role permissions", error);
      }
    };

    fetchRolePermissions();
  }, []);


  // ✅ Auto-select default tab based on first allowed permission
  useEffect(() => {
    if (!reviewPermissions || activeTab !== "") return;

    for (const tab of TABS) {
      const perm = reviewPermissions[tab.perm];
      if (perm?.create || perm?.edit) {
        setActiveTab(tab.key);
        break;
      }
    }
  }, [reviewPermissions]);

  const getTabButtonClass = (tabName) => {
    return `appraisal-tab-button ${activeTab === tabName ? "active-appraisal-tab" : ""}`;
  };


  const getStatusColor = (status) => {
    return status === "Active" ? "#4CAF50" : "#F44336";
  };


  const getReviewColor = (status) => {
    return status === "Completed" ? "#4CAF50" : "#F44336";
  };


  const handleEditAppraisal = (employee_id) => {
    navigate(`/appraisal/review/details/${employee_id}`);
  };


  // ✅ Render selected tab component
  const renderActiveComponent = () => {
    const active = TABS.find((t) => t.key === activeTab);
    if (!active) return null;

    const Component = active.component;
    return (
      <Component
        rolePermissions={reviewPermissions["ReviewAppraisalList"]}
        getStatusColor={getStatusColor}
        getReviewColor={getReviewColor}
        handleEditAppraisal={handleEditAppraisal}
      />
    );
  };

  return (
    <div className="appraisal-list-container">
      <h2 className="appraisal-list-title">Review Appraisals</h2>
      {reviewPermissions["ReviewAppraisalList"]?.view && (
        <div className="appraisal-tabs-container">
          {/* ✅ Render only permitted tabs */}
          <div className="appraisal-tabs-buttons">
            {TABS.map((tab) => {
              const perm = reviewPermissions[tab.perm];
              if (!perm?.create && !perm?.edit) return null;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={getTabButtonClass(tab.key)}
                >
                  {tab.key}
                </button>
              );
            })}
          </div>

          {/* ✅ Render Active Component */}
          <div className="appraisal-content">{renderActiveComponent()}</div>
        </div>
      )}
    </div>
  );
};

export default ReviewAppraisals;
