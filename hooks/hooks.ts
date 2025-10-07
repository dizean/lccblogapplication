import { fetchEmployeesLog, fetchEmployees, timeIn, timeOut, addEmployee, updateEmployee, deleteEmployee } from "./employees/hook";
import { addKey, borrowKey, fetchKeys, fetchKeysLog, returnKey } from "./keys/hook";
import { visitorLogin, visitorLogout, visitors } from "./visitors/hook";

export const hooks = {
    fetchEmployees, fetchEmployeesLog, timeIn, timeOut, addEmployee,updateEmployee, deleteEmployee, 
    fetchKeys, fetchKeysLog, borrowKey, returnKey, addKey,
    visitors, visitorLogin, visitorLogout,
}