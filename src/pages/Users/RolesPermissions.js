import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { getUserRoleReq } from "../../service/branchService";
import { Card, CardBody } from "reactstrap";

const RolesPermissions = (props) => {
    const breadcrumbItems = [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Roles & Permissions", link: "#" },
    ];
    const [rolesList, setRoleslist] = useState([]);
    const [isAdmin, setIsAdmin] = useState(true)
    const operationsList = ["read", "create", "update", "delete"];

    const getAllRoles = async (isAdmin) => {
        try {
          if(isAdmin) {
            const response = await getUserRoleReq(true);
            setRoleslist(response?.payload?.roles);
            console.log("11", isAdmin)
          } else {
            const response = await getUserRoleReq(false);
            setRoleslist(response?.payload?.roles);
            console.log("12", isAdmin)
          }
        } catch (error) {
          console.log(error);
        }
      };
    
    useEffect(() => {
      props.setBreadcrumbItems("Roles & Permission", breadcrumbItems);
    }, [isAdmin]);

    useEffect(() => {
      getAllRoles(isAdmin)
      console.log(rolesList, isAdmin)
    }, [isAdmin]);

    return (
        <div>
          <Card style={{ marginBottom: "1rem" }}>
            <CardBody style={{ padding: '0', display: 'flex', flexDirection: "row"}}>
            <h5 style={{ margin: 0, width: '50%', textAlign: "center", cursor: 'pointer', color: isAdmin ? '#0053ff' : '#000', padding: '1rem 1rem', borderBottom: isAdmin ? '2px solid #0053ff' : '0',}} onClick={() => { setIsAdmin(true)}}>Admin User</h5>
            <h5 style={{ margin: 0, width: '50%', textAlign: "center", cursor: 'pointer', color: !isAdmin ? '#0053ff' : '#000', padding: '1rem 1rem', borderBottom: !isAdmin ? '2px solid #0053ff' : '0'}}  onClick={() => { setIsAdmin(false)}}>Client User</h5>
            </CardBody>
          </Card>
        {rolesList.map((role) => (
          <Card key={role._id}>
            <CardBody style={{ padding: '1rem 1rem 0.5rem' }}>
              <h4 style={{borderBottom: "1px solid #ddd", paddingBottom: "1rem", margin: 0}}>{role.title}</h4>
              {/* Table Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "0.5rem",
                  borderBottom: "1px solid #ddd",
                  marginBottom: "1rem",
                  padding: "0.5rem 1rem"
                }}
              >
                <span style={{ flex: "1", fontWeight: "bold"}}>Module</span>
                <div style={{ display: "flex", gap: "2rem" }}>
                  {operationsList.map((operation) => (
                    <span key={operation} style={{ fontWeight: "bold" }}>
                      {operation.charAt(0).toUpperCase() + operation.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
  
              {/* Module Rows */}
              {role.permissions.map((permission) => (
                <div
                  key={permission._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    padding: "0 1rem"
                  }}
                >
                  {/* Module Name */}
                  <span style={{ flex: "1", fontWeight: '500', fontSize: '14px' }}>{permission.module.charAt(0).toUpperCase() + permission.module.slice(1)}</span>
                  {/* Checkboxes for operations */}
                  <div style={{ display: "flex" }}>
                    {operationsList.map((operation) => (
                      <input
                      style={{margin: '0 1.8rem'}}
                        key={operation}
                        type="checkbox"
                        checked={permission.operations.includes(operation)}
                        readOnly
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    )
}

export default connect(null, { setBreadcrumbItems })(RolesPermissions);
