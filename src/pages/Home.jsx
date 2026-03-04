import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTranslation } from 'react-i18next';
import Toast from '../components/Toast';
import './Home.css';

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytB-Z0w0-LikTqGOYFIM-oKkdAMtEHxMGc1YK1tCxGo9AxwPSym9yb1Z4o2GXn921d/exec"; // Replace this with your Google Apps Script URL later

const Home = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const hasTriggeredConfetti = useRef(false);

  useEffect(() => {
    // Toggling image index every 2 seconds for the diamond cards
    const imageInterval = setInterval(() => {
      setImageIndex(prev => (prev === 0 ? 1 : 0));
    }, 2000);

    return () => clearInterval(imageInterval);
  }, []);

  useEffect(() => {
    let timer1, timer2, timer3, timer4, timer5;
    timer1 = setTimeout(() => setStep(1), 100);
    timer2 = setTimeout(() => setStep(2), 1000);
    timer3 = setTimeout(() => setStep(3), 2000);
    timer4 = setTimeout(() => setStep(4), 3000);
    timer5 = setTimeout(() => setStep(5), 5000); // Trigger final UI swap after 3 seconds of blast

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  useEffect(() => {
    if (step === 4 && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      triggerConfetti();
    }
  }, [step]);

  const triggerConfetti = () => {
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_SCRIPT_URL_HERE") {
      setToast({ message: "Please configure your GOOGLE_SCRIPT_URL at the top of Home.jsx first!", type: "error" });
      setIsSubmitting(false);
      return;
    }

    const formElement = e.target;
    const formData = new FormData(formElement);
    const fileInput = formElement.querySelector('input[type="file"]');
    const file = fileInput.files[0];

    if (!file) {
      setToast({ message: "Payment screenshot is required!", type: "error" });
      setIsSubmitting(false);
      return;
    }

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Remove data URL prefix
      formData.append('base64File', base64String);
      formData.append('fileName', file.name);
      formData.append('mimeType', file.type);

      // Using mode: 'no-cors' elegantly bypasses CORS preflight restrictions from React to Google Scripts
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      })
        .then(() => {
          // 2. Ping the local WhatsApp Express server asynchronously
          const phone = formElement.phoneNumber.value || formData.get('phoneNumber');
          const name = formElement.participantName.value || formData.get('participantName');

          fetch('http://localhost:3001/api/send-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, name })
          })
            .then(res => res.json())
            .then(data => console.log('WhatsApp Server Status:', data))
            .catch(err => console.error('WhatsApp ping failed (is the Node server running?):', err));

          // 3. Close out the UI
          triggerConfetti(); // Trigger confetti on successful submission
          setIsSubmitting(false);
          setIsModalOpen(false);
          setToast({ message: "Enrollment Submitted Successfully! Check your WhatsApp for a confirmation receipt.", type: "success" });
          formElement.reset(); // Clear the form
        })
        .catch((error) => {
          console.error("Submission error", error);
          setToast({ message: "Failed to enroll. Please try again.", type: "error" });
          setIsSubmitting(false);
        });
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setToast({ message: "Error processing the image file. Please try again.", type: "error" });
      setIsSubmitting(false);
    };

    reader.readAsDataURL(file);
  };

  const wordAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2, filter: "blur(10px)" },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const fullPhraseAnimation = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", bounce: 0.5, duration: 1.5 }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(5px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { type: "spring", bounce: 0.3, duration: 1 } }
  };

  const modalVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <div className={`home-container ${isModalOpen ? 'modal-open' : ''}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* 100vh Hero Banner */}
      <div className="hero-section">
        <div className="animation-wrapper">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="happy" className="word-container" {...wordAnimation}>
                <h1 className="text-gradient happy-gradient">Happy</h1>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="womens" className="word-container" {...wordAnimation}>
                <h1 className="text-gradient womens-gradient">Women's</h1>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="day" className="word-container" {...wordAnimation}>
                <h1 className="text-gradient day-gradient">Day</h1>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="full" className="phrase-container" {...fullPhraseAnimation}>
                <h1 className="text-gradient happy-gradient inline-word">Happy</h1>
                <h1 className="text-gradient womens-gradient inline-word">Women's</h1>
                <h1 className="text-gradient day-gradient inline-word">Day</h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Rendered Smoothly Later */}
      <AnimatePresence>
        {step === 5 && (
          <motion.div
            className="final-ui-overlay"
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
          >
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
            {/* Quote Section */}
            <section className="quote-section">
              <p className="quote-text">
                “Celebrate your strength, share your talent, and let your voice shine this Women’s Day.”
              </p>
            </section>

            {/* Diamond Cards Section */}
            <section className="cards-section">
              <div className="cards-container">

                {/* Group 1 Card */}
                <div className="diamond-card">
                  <div className="diamond-image-container">
                    <AnimatePresence>
                      {imageIndex === 0 ? (
                        <motion.img
                          key="cooking"
                          src="/images/cooking.png"
                          alt="Cooking"
                          className="diamond-image"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ) : (
                        <motion.img
                          key="adzap"
                          src="/images/adzap.jpg"
                          alt="Adzap"
                          className="diamond-image"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <h3 className="card-title">Cooking / Adzap</h3>
                </div>

                {/* Group 2 Card */}
                <div className="diamond-card">
                  <div className="diamond-image-container">
                    <AnimatePresence>
                      {imageIndex === 0 ? (
                        <motion.img
                          key="dance"
                          src="/images/dance.png"
                          alt="Dance"
                          className="diamond-image"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ) : (
                        <motion.img
                          key="bouquet"
                          src="/images/bouquet.webp"
                          alt="Bouquet Making"
                          className="diamond-image"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <h3 className="card-title">Dance / Bouquet</h3>
                </div>

                {/* Group 3 Card */}
                <div className="diamond-card">
                  <div className="diamond-image-container">
                    <AnimatePresence>
                      {imageIndex === 0 ? (
                        <motion.img
                          key="rangoli"
                          src="/images/rangoli.webp"
                          alt="Rangoli"
                          className="diamond-image"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      ) : (
                        <motion.img
                          key="fashion"
                          src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=500&q=80"
                          alt="Fashion Show"
                          className="diamond-image"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <h3 className="card-title">Rangoli / Fashion</h3>
                </div>
              </div>

              {/* Enroll Button */}
              <div className="enroll-btn-container">
                <button className="enroll-main-btn" onClick={() => setIsModalOpen(true)}>
                  {t('enrollNow')}
                </button>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              variants={modalVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
              <h2 className="modal-title">{t('eventRegistration')}</h2>

              <form className="enroll-form" onSubmit={handleEnrollSubmit}>

                <div className="form-group">
                  <label>{t('participantName')}</label>
                  <input type="text" name="participantName" placeholder="Enter your full name" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('age')}</label>
                    <input type="number" name="age" min="5" max="100" placeholder="e.g. 24" required />
                  </div>

                  <div className="form-group">
                    <label>{t('phoneNumber')}</label>
                    <input type="tel" name="phoneNumber" placeholder="Enter your mobile number" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>{t('address')}</label>
                  <textarea rows="2" name="address" placeholder="Enter your complete address" required></textarea>
                </div>

                <div className="form-divider"></div>
                <h3 className="competition-title">{t('competitionSelection')}</h3>
                <p className="competition-subtitle">Please choose exactly one activity from each group.</p>

                <div className="competition-group">
                  <h4>{t('group1')}</h4>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input type="radio" name="group1" value="Cooking" required />
                      <span className="radio-custom"></span> {t('cooking')}
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="group1" value="Adzap" required />
                      <span className="radio-custom"></span> {t('adzap')}
                    </label>
                  </div>
                </div>

                <div className="competition-group">
                  <h4>{t('group2')}</h4>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input type="radio" name="group2" value="Dance" required />
                      <span className="radio-custom"></span> {t('dance')}
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="group2" value="Bouquet Making" required />
                      <span className="radio-custom"></span> {t('bouquetMaking')}
                    </label>
                  </div>
                </div>

                <div className="competition-group">
                  <h4>{t('group3')}</h4>
                  <div className="radio-options">
                    <label className="radio-label">
                      <input type="radio" name="group3" value="Rangoli" required />
                      <span className="radio-custom"></span> {t('rangoli')}
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="group3" value="Fashion Show" required />
                      <span className="radio-custom"></span> {t('fashionShow')}
                    </label>
                  </div>
                </div>

                <div className="form-divider"></div>
                <div className="form-group">
                  <label>{t('paymentAmount')}</label>
                  <input type="text" name="paymentAmount" value="200" readOnly className="readonly-input" />
                </div>

                {/* QR Code / UPI Section */}
                <div className="payment-options-container">
                  <div className="desktop-qr-payment">
                    <p className="payment-instruction">Scan to Pay via any UPI App</p>
                    {/* Placeholder QR Code image */}
                    <img
                      src="/images/upi1.jpeg"
                      alt="Payment QR Code"
                      className="qr-code-img"
                    />
                  </div>

                  <div className="mobile-upi-payment">
                    <p className="payment-instruction">Choose payment method:</p>
                    <a href="upi://pay?pa=9487588713@ybl&pn=PRADEEBAA&am=200&cu=INR&tn=WomensDay" className="upi-pay-btn" style={{marginBottom: '10px'}}>
                      Pay ₹200 (Auto-fill)
                    </a>
                    <a href="upi://pay?pa=9487588713@ybl&pn=PRADEEBAA" className="upi-pay-btn" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                      Pay Manually
                    </a>
                    <p className="payment-note" style={{fontSize: '0.8rem', color: '#ffd700', marginTop: '8px'}}>If first button fails, use second & enter ₹200</p>
                  </div>
                </div>

                <div className="form-group file-upload-group">
                  <label>Upload Payment Screenshot <span className="required-star">*</span></label>
                  <p className="file-instruction">Please upload a clear screenshot of your successful transaction.</p>
                  <input type="file" name="paymentScreenshot" accept="image/*" className="file-input" required />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? t('submitting') : t('submitRegistration')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
