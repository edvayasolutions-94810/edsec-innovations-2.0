const axios = require('axios');
const test = async () => {
    try {
        const getRes = await axios.get('http://localhost:5000/api/students', {
            headers: { Authorization: "Bearer admin-bypass-token" }
        });
        console.log(`GET Success: Found ${getRes.data.length} students total.`);
        getRes.data.forEach((s, idx) => console.log(`[${idx}] ${s.full_name} - ${s.email} - ${s.enrollment_date}`));
    } catch (e) {
        console.log("Error:", e.response ? e.response.data : e.message);
    }
}
test();
