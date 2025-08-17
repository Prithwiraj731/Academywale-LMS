import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaMobileAlt, FaDesktop, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'https://academywale-lms.onrender.com';
const UPI_ID = 'shivanshkashyap27-2@oksbi';

const UPIPaymentPage = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mobile'); // 'mobile' or 'qr'
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Get details passed from the previous page
  const selectedMode = location.state?.selectedMode || '';
  const selectedValidity = location.state?.selectedValidity || '';
  const userDetails = location.state?.userDetails || {};
  const priceFromState = location.state?.price;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/courses/details/${courseId}`);
        const data = await res.json();
        
        if (res.ok) {
          setCourse(data.course);
        } else {
          setError(data.message || 'Failed to fetch course details');
        }
      } catch (err) {
        setError('Server error while fetching course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login', { 
        state: { 
          from: `/payment/${courseType}/${courseId}`,
          message: 'Please log in to proceed with payment'
        } 
      });
    }
  }, [isAuthenticated, loading, navigate, courseId, courseType]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const generateUpiLink = () => {
    if (!course) return '';
    
    const amount = priceFromState || course.sellingPrice || 0;
    const courseName = course.title || course.subject || 'Course Payment';
    const transactionRef = `AW${Date.now().toString().slice(-6)}`;
    
    return `upi://pay?pa=${UPI_ID}&pn=AcademyWale&mc=0000&tid=${transactionRef}&tr=${courseId}&tn=${encodeURIComponent(courseName)}&am=${amount}&cu=INR`;
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handlePaymentVerification = async (e) => {
    e.preventDefault();
    
    if (!transactionId) {
      alert('Please enter your UPI transaction ID/reference number');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Record the purchase in the database
      const purchaseRes = await fetch(`${API_URL}/api/purchase/upi-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
        },
        body: JSON.stringify({
          userId: user?._id,
          courseId: courseId,
          transactionId: transactionId,
          amount: priceFromState || (course?.sellingPrice || 0),
          paymentMethod: 'UPI',
          userDetails: {
            name: userDetails.fullName || user?.name,
            email: userDetails.email || user?.email,
            phone: userDetails.phone || user?.phone
          },
          courseDetails: {
            courseName: course?.title || course?.subject,
            mode: selectedMode,
            validity: selectedValidity
          }
        })
      });
      
      const data = await purchaseRes.json();
      
      if (purchaseRes.ok) {
        // Send email notification
        await fetch(`${API_URL}/api/notify/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'support@academywale.com',
            subject: 'New Course Purchase',
            text: `
              New purchase notification:
              Course: ${course?.title || course?.subject}
              User: ${userDetails.fullName || user?.name} (${userDetails.email || user?.email})
              Phone: ${userDetails.phone || user?.phone}
              Amount: ₹${priceFromState || (course?.sellingPrice || 0)}
              Transaction ID: ${transactionId}
              Mode: ${selectedMode}
              Validity: ${selectedValidity}
            `
          })
        });
        
        // Show success and redirect
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate('/student-dashboard');
        }, 3000);
      } else {
        setError(data.message || 'Failed to verify payment');
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError('Server error during payment verification');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-700 mb-6">
            Your payment has been received and your course purchase is complete. You will be redirected to your dashboard shortly.
          </p>
          <div className="animate-pulse mb-6">
            <div className="h-2 bg-green-100 rounded-full mb-2"></div>
            <div className="h-2 bg-green-100 rounded-full"></div>
          </div>
          <button
            onClick={() => navigate('/student-dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!course && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 font-bold text-xl mb-4">Course not found</div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-2xl font-bold">Complete Your Payment</h1>
            <p className="opacity-90">Follow the steps below to complete your purchase</p>
          </div>
          
          <div className="p-6">
            {/* Course Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-800">Order Summary</h3>
              <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="text-gray-600">Course:</div>
                <div className="text-gray-900 font-medium">{course?.title || course?.subject}</div>
                
                {selectedMode && (
                  <>
                    <div className="text-gray-600">Mode:</div>
                    <div className="text-gray-900">{selectedMode}</div>
                  </>
                )}
                
                {selectedValidity && (
                  <>
                    <div className="text-gray-600">Validity:</div>
                    <div className="text-gray-900">{selectedValidity}</div>
                  </>
                )}
                
                <div className="text-gray-600">Amount:</div>
                <div className="text-gray-900 font-bold">₹{priceFromState || course?.sellingPrice}</div>
              </div>
            </div>
            
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Choose Payment Method</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('mobile')}
                  className={`flex items-center px-4 py-3 rounded-lg border-2 ${
                    paymentMethod === 'mobile' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaMobileAlt className={`mr-2 ${paymentMethod === 'mobile' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className={paymentMethod === 'mobile' ? 'font-medium' : ''}>Mobile UPI App</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('qr')}
                  className={`flex items-center px-4 py-3 rounded-lg border-2 ${
                    paymentMethod === 'qr' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaQrcode className={`mr-2 ${paymentMethod === 'qr' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className={paymentMethod === 'qr' ? 'font-medium' : ''}>Scan QR Code</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handlePaymentMethodChange('desktop')}
                  className={`flex items-center px-4 py-3 rounded-lg border-2 ${
                    paymentMethod === 'desktop' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FaDesktop className={`mr-2 ${paymentMethod === 'desktop' ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className={paymentMethod === 'desktop' ? 'font-medium' : ''}>Desktop</span>
                </button>
              </div>
            </div>
            
            {/* Payment Instructions */}
            {paymentMethod === 'mobile' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Pay using UPI App</h3>
                <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                  <li>Click the "Pay Now" button below</li>
                  <li>It will open your UPI app automatically</li>
                  <li>Complete the payment in your UPI app</li>
                  <li>Return here and enter the UPI Reference ID</li>
                  <li>Click "Verify Payment" to complete your purchase</li>
                </ol>
                
                <div className="flex justify-center my-4">
                  <a 
                    href={generateUpiLink()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaMobileAlt className="mr-2" /> Pay Now ₹{priceFromState || course?.sellingPrice}
                  </a>
                </div>
              </div>
            )}
            
            {paymentMethod === 'qr' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Pay by scanning QR Code</h3>
                <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                  <li>Open any UPI app on your mobile phone</li>
                  <li>Scan the QR code shown below</li>
                  <li>Pay the amount: ₹{priceFromState || course?.sellingPrice}</li>
                  <li>Enter the UPI Reference ID below</li>
                </ol>
                
                <div className="flex justify-center my-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <img src="/qr.jpg" alt="UPI QR Code" className="w-48 h-48 object-contain" />
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-center mb-2">
                  <div>
                    <p className="text-gray-700 mb-1">UPI ID: <span className="font-medium">{UPI_ID}</span></p>
                    <button
                      onClick={copyUpiId}
                      className={`text-sm ${copySuccess ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      {copySuccess ? 'Copied!' : 'Copy UPI ID'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'desktop' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-blue-800 mb-2">Pay from Desktop</h3>
                <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                  <li>Open any UPI app on your mobile phone</li>
                  <li>Scan the QR code shown below or use the UPI ID</li>
                  <li>Pay amount: ₹{priceFromState || course?.sellingPrice}</li>
                  <li>Enter transaction reference number below</li>
                </ol>
                
                <div className="flex justify-center my-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <img src="/qr.jpg" alt="UPI QR Code" className="w-48 h-48 object-contain" />
                  </div>
                </div>
                
                <div className="flex items-center justify-center text-center mb-2">
                  <div>
                    <p className="text-gray-700 mb-1">UPI ID: <span className="font-medium">{UPI_ID}</span></p>
                    <button
                      onClick={copyUpiId}
                      className={`text-sm ${copySuccess ? 'text-green-600' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      {copySuccess ? 'Copied!' : 'Copy UPI ID'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Transaction ID Form */}
            <form onSubmit={handlePaymentVerification} className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Verify Your Payment</h3>
              <div className="mb-4">
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter UPI Reference/Transaction ID
                </label>
                <input
                  type="text"
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 123456789012"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">You can find this in your UPI payment confirmation</p>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center disabled:opacity-70"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" /> Verify Payment
                  </>
                )}
              </button>
            </form>
            
            {/* Help Text */}
            <div className="text-sm text-gray-600 border-t border-gray-200 pt-4">
              <p className="mb-2">Having trouble with payment? Contact our support:</p>
              <p className="font-medium">Email: support@academywale.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentPage;
