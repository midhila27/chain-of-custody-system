import React, { useState } from 'react';
import { registerUser } from '../api/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm]   = useState({
    fullName:'', email:'',
    password:'', role:'OFFICER', department:'', phone:''
  });
  const [loading, setLoading]     = useState(false);
  const [generatedBadge, setBadge] = useState(null);
  const navigate                  = useNavigate();

  const inp = {
    width:'100%', padding:'10px', margin:'5px 0 14px 0',
    background:'#16213e', color:'#fff',
    border:'1px solid #333', borderRadius:'6px',
    boxSizing:'border-box', fontSize:'14px'
  };

  const handleChange = e =>
    setForm({...form, [e.target.name]: e.target.value});

  const handleRegister = async () => {
    if (!form.fullName || !form.password) {
      toast.error('Fill required fields!'); return;
    }
    setLoading(true);
    try {
      const res = await registerUser(form);
      setBadge(res.data.badgeNumber);
      toast.success('Account created!');
    } catch {
      toast.error('Registration failed!');
    }
    setLoading(false);
  };

  // Success screen — show generated badge number
  if (generatedBadge) {
    return (
      <div style={{
        minHeight:'100vh', background:'#0a0a0a',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'20px'
      }}>
        <div style={{
          background:'#1a1a2e', padding:'40px',
          borderRadius:'12px', width:'420px',
          border:'1px solid #333', textAlign:'center'
        }}>
          <div style={{ fontSize:'48px', marginBottom:'16px' }}>✅</div>
          <h2 style={{ color:'#fff', marginBottom:'8px' }}>Account Created!</h2>
          <p style={{ color:'#aaa', fontSize:'13px', marginBottom:'24px' }}>
            Your badge number has been auto-generated
          </p>

          <div style={{
            background:'#0d1f35', border:'2px dashed #185FA5',
            borderRadius:'10px', padding:'20px', marginBottom:'20px'
          }}>
            <div style={{ color:'#64748b', fontSize:'11px', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>
              Your Badge Number
            </div>
            <div style={{
              color:'#4fc3f7', fontSize:'26px', fontWeight:'700',
              fontFamily:"'Courier New', monospace", letterSpacing:'1px'
            }}>
              {generatedBadge}
            </div>
          </div>

          <p style={{ color:'#fbbf24', fontSize:'12px', marginBottom:'24px' }}>
            ⚠️ Save this badge number — you'll need it to login
          </p>

          <button
            onClick={() => navigate('/login')}
            style={{
              width:'100%', padding:'13px',
              background:'#185FA5', color:'#fff', border:'none',
              borderRadius:'6px', fontSize:'15px', cursor:'pointer', fontWeight:'500'
            }}>
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight:'100vh',
      background:'#0a0a0a',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      padding:'20px'
    }}>
      <div style={{
        background:'#1a1a2e',
        padding:'35px',
        borderRadius:'12px',
        width:'480px',
        border:'1px solid #333'
      }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'25px' }}>
          <div style={{
            width:'50px', height:'50px',
            background:'#185FA5', borderRadius:'10px',
            display:'flex', alignItems:'center',
            justifyContent:'center', margin:'0 auto 12px'
          }}>
            <span style={{ fontSize:'24px' }}>🔐</span>
          </div>
          <h2 style={{ color:'#fff', margin:'0', fontSize:'20px' }}>
            Officer Registration
          </h2>
          <p style={{ color:'#aaa', fontSize:'12px', marginTop:'5px' }}>
            Create your account — badge number is auto-assigned
          </p>
        </div>

        {/* Grid Form */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          gap:'0 15px'
        }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ color:'#aaa', fontSize:'12px' }}>
              Full Name *
            </label>
            <input style={inp} name="fullName"
                   placeholder="Officer Full Name"
                   onChange={handleChange} />
          </div>
          <div>
            <label style={{ color:'#aaa', fontSize:'12px' }}>
              Email
            </label>
            <input style={inp} name="email"
                   type="email"
                   placeholder="officer@police.gov.in"
                   onChange={handleChange} />
          </div>
          <div>
            <label style={{ color:'#aaa', fontSize:'12px' }}>
              Phone
            </label>
            <input style={inp} name="phone"
                   placeholder="Mobile number"
                   onChange={handleChange} />
          </div>
          <div>
            <label style={{ color:'#aaa', fontSize:'12px' }}>
              Department
            </label>
            <input style={inp} name="department"
                   placeholder="e.g. Cyber Crime"
                   onChange={handleChange} />
          </div>
          <div>
            <label style={{ color:'#aaa', fontSize:'12px' }}>
              Role *
            </label>
            <select style={{...inp, cursor:'pointer'}}
                    name="role" onChange={handleChange}>
              <option value="OFFICER">Officer</option>
              <option value="INVESTIGATOR">Investigator</option>
              <option value="FORENSIC_OFFICER">Forensic Officer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <label style={{ color:'#aaa', fontSize:'12px' }}>
          Password *
        </label>
        <input style={inp} name="password"
               type="password"
               placeholder="Create password"
               onChange={handleChange} />

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width:'100%', padding:'13px',
            background: loading ? '#333' : '#185FA5',
            color:'#fff', border:'none',
            borderRadius:'6px', fontSize:'15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight:'500'
          }}>
          {loading ? '⏳ Registering...' : 'Create Account'}
        </button>

        <div style={{
          textAlign:'center', marginTop:'16px',
          color:'#aaa', fontSize:'13px'
        }}>
          Already have account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color:'#4fc3f7', cursor:'pointer' }}>
            Login here
          </span>
        </div>
      </div>
    </div>
  );
}