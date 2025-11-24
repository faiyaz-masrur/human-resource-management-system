import { useState, useEffect } from 'react';
import api from '../../services/api';

const RmReviewList = ({ rolePermissions, getReviewColor, getStatusColor, handleEditAppraisal }) => {
  const [reviewAppraisalList, setReviewAppraisalList] = useState([]);


  useEffect(() => {
    const fetchReviewAppraisalList= async () => {
      try {
        if (rolePermissions?.view) {
          const res = await api.get(`appraisals/review-appraisal-list/rm-review/`);
          console.log("RM Review Appraisal List:", res?.data);
          setReviewAppraisalList(Array.isArray(res.data) ? res.data : res.data ? [res.data] : [])
        }  
      } catch (error) {
        console.warn("Error fetching rm review appraisal List:", error);
        setReviewAppraisalList([]);
      }
    };

    fetchReviewAppraisalList();
  }, [rolePermissions]);


  return (
      <div className="appraisal-table-responsive">
        <table className="appraisal-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Dept</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Review</th>
              {rolePermissions?.edit && (<th>Actions</th>)}
            </tr>
          </thead>
          <tbody>
            {reviewAppraisalList.map((reviewAppraisal, index) => (
              <tr key={index}>
                <td>{reviewAppraisal.emp_id}</td>
                <td>{reviewAppraisal.emp_name}</td>
                <td>{reviewAppraisal.emp_dept}</td>
                <td>{reviewAppraisal.emp_des}</td>
                <td>
                  <span 
                    style={{ 
                      color: getStatusColor(reviewAppraisal.active_status ? 'Active' : 'Inactive'), 
                      fontWeight: 'bold' 
                    }}>
                    {reviewAppraisal.active_status ? 'Active' : 'Inactive'}
                  </span>
                </td> 
                <td>
                  <span 
                    style={{ 
                      color: getReviewColor(reviewAppraisal.rm_review ? 'Completed' : 'Pending'), 
                      fontWeight: 'bold' 
                    }}>
                    {reviewAppraisal.rm_review ? 'Completed' : 'Pending'}
                  </span>
                </td> 
                {rolePermissions?.edit && 
                  <td>
                    <div className="ar-actions-cell">
                      <button 
                          className="action-button-light action-button--edit-light" 
                          onClick={() => handleEditAppraisal(reviewAppraisal.emp_id)}
                          title="edit appraisal"
                      >
                          &#9998; {/* Pen emoji for Edit */}
                      </button>
                    </div>
                  </td>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}

export default RmReviewList