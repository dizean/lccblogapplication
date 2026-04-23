import { fetchEmployeesLog, fetchEmployees, timeIn, timeOut, addEmployee, updateEmployee, deleteEmployee, fetchEmployeesRangeLog } from "./employees/hook";
import { addKey, borrowKey, fetchKeys, fetchKeysLog, fetchKeysRangeLog, returnKey } from "./keys/hook";
import { visitorLogin, visitorLogout, visitors, fetchVisitorsRangeLog } from "./visitors/hook";

export const hooks = {
    fetchEmployees, fetchEmployeesLog, timeIn, timeOut, addEmployee,updateEmployee, deleteEmployee, 
    fetchKeys, fetchKeysLog, borrowKey, returnKey, addKey,
    visitors, visitorLogin, visitorLogout, fetchEmployeesRangeLog, fetchKeysRangeLog, fetchVisitorsRangeLog
}