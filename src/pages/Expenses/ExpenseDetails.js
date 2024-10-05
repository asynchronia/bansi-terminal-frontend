import { connect } from "react-redux";
import { setBreadcrumbItems } from "../../store/actions";
import { useEffect } from "react";

const ExpenseDetails = (props) => {
    const breadcrumbItems = [
        { title: "Dashboard", link: "#" },
        { title: "Expenses", link: "/expenses" },
        { title: "Expense Details", link: "/expenses/:id" },
    ];

    useEffect(() => {
        props.setBreadcrumbItems("Invoices", breadcrumbItems);
    }, [breadcrumbItems]);

    return <h2>Expense Details</h2>
    
}

export default connect(null, { setBreadcrumbItems })(ExpenseDetails);