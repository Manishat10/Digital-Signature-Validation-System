import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/userdashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [deleteCertNumber, setDeleteCertNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
          fetchCertificates(token);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    const fetchCertificates = async (token) => {
      try {
        const response = await fetch('http://localhost:5000/api/certificates/user-certificates', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setCertificates(data);
        } else {
          console.error('Failed to fetch certificates');
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleDeleteCertificate = async () => {
    if (!deleteCertNumber.trim()) {
      alert('Please enter a certificate number to delete.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/certificates/${deleteCertNumber}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Certificate deleted successfully');
        setCertificates(certificates.filter(cert => cert.certificatenumber !== deleteCertNumber));
        setDeleteCertNumber('');
      } else {
        alert(data.message || 'Failed to delete certificate');
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Server error while deleting the certificate.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateCertificate = () => {
    navigate("/certificateform");
  };

  const handleViewCertificate = () => {
    if (certificateNumber.trim() !== '') {
      navigate(`/certificate/${certificateNumber}`);
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>
      <button onClick={handleCreateCertificate}>Create New Certificate</button>
      <button onClick={handleLogout}>Logout</button>

      <input
        type="text"
        placeholder="Enter Certificate Number to View"
        value={certificateNumber}
        onChange={(e) => setCertificateNumber(e.target.value)}
      />
      <button onClick={handleViewCertificate}>View Certificate</button>
      

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Certificate Number</th>
              <th>Particulars</th>
              <th>Description</th>
              <th>Signatory</th>
              <th>Date</th>
              <th>Time</th>
              <th>IP</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, index) => (
              <tr key={index}>
                <td>{cert.certificatenumber}</td>
                <td>{cert.particulars}</td>
                <td>{cert.description}</td>
                <td>{cert.signatoryname}</td>
                <td> {new Date(cert.creationdate).toLocaleDateString('en-GB')}</td>
                <td>{cert.creationtime}</td>
                <td>{cert.deviceip}</td>
                <td> {new Date(cert.expirydate).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="delete-certificate-container">
        <input
          type="text"
          placeholder="Enter Certificate Number to Delete"
          value={deleteCertNumber}
          onChange={(e) => setDeleteCertNumber(e.target.value)}
        />
        <button onClick={handleDeleteCertificate}>Delete Certificate</button>
      </div>
    </div>
  );
};

export default UserDashboard;
