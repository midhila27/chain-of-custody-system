import axios from 'axios';

const EVIDENCE = 'http://localhost:8081/api/evidence';
const CUSTODY  = 'http://localhost:8082/api/custody';
const USERS    = 'http://localhost:8083/api/users';
const AUDIT    = 'http://localhost:8084/api/audit';
export const loginUser = (badge, password) =>
  axios.post(`${USERS}/login`, null, {
    params: { badge, password }
  });

export const registerUser = (data) =>
  axios.post(`${USERS}/register`, data);
export const uploadEvidence = (formData) =>
  axios.post(`${EVIDENCE}/upload`, formData, {
    headers:{ 'Content-Type':'multipart/form-data' }
  });

export const getAllEvidence = () =>
  axios.get(`${EVIDENCE}/all`);

export const checkTamper = (id, checkedBy, badge) =>
  axios.post(`${EVIDENCE}/check-tamper/${id}`,null,{
    params:{ checkedBy, badge }
  });

export const transferCustody = (data) =>
  axios.post(`${CUSTODY}/transfer`, null, { params:data });

export const getAllCustody = () =>
  axios.get(`${CUSTODY}/all`);

export const getAllUsers = () =>
  axios.get(`${USERS}/all`);

export const getAllAudit = () =>
  axios.get(`${AUDIT}/all`);

export const getTamperAlerts = () =>
  axios.get(`${AUDIT}/tamper-alerts`);