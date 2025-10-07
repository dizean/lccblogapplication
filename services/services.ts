import { addEmployee, deleteEmployee, fetchEmployeeById, fetchEmployees, updateEmployee } from "./employee";
import { fetchEmployeesLog, timeIn, timeOut } from "./employeesLog";
import { addKey, fetchKeys } from "./keys";
import { fetchKeysLog, borrowKey, returnKey } from "./keysLog";
import { fetchVisitors, visitorLogin, visitorLogout } from "./visitors";

export const services = {
    fetchEmployees, fetchEmployeesLog, timeIn, timeOut,
    addEmployee, updateEmployee, deleteEmployee, fetchEmployeeById,
    fetchKeys, fetchKeysLog, borrowKey, returnKey,
    addKey,
    fetchVisitors, visitorLogin, visitorLogout,
}