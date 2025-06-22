import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/legal-pages.css';

const PrivacyPolicyPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    // Add animation delay to simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [isLoaded]);

  const lastUpdated = "May 1, 2025";

  // Privacy Policy sections
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `At Solace Wave Therapy, we are committed to protecting your privacy and safeguarding your personal and health information. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website, mobile application, and services (collectively, the "Services").

Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.`
    },
    {
      id: "information-collected",
      title: "Information We Collect",
      content: `We collect several types of information from and about users of our Services, including:

Personal Information: This includes information that can be used to identify you, such as your name, email address, postal address, phone number, date of birth, and payment information.

Health Information: This includes mental health assessments, therapy notes, treatment history, and other health-related information you provide or that is generated through your use of our Services.

Usage Information: This includes information about how you use our Services, such as the pages you visit, the time and duration of your visits, and the actions you take within our Services.

Device Information: This includes information about the devices you use to access our Services, such as IP address, device type, operating system, browser type, and mobile network information.

Location Information: With your consent, we may collect precise location information from your device. You can disable location services through your device settings.`
    },
    {
      id: "information-collection-methods",
      title: "How We Collect Information",
      content: `We collect information in several ways:

Direct Collection: Information you provide to us directly when you create an account, complete our assessment, communicate with therapists, or otherwise interact with our Services.

Automated Collection: Information collected automatically as you navigate through our Services, using cookies, web beacons, and other tracking technologies.

Third-Party Sources: We may receive information about you from third parties, such as business partners, healthcare providers (with your consent), and data analytics providers.`
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      content: `We use your information for various purposes, including:

Providing and Improving Our Services: To operate, maintain, and enhance our Services, including matching you with appropriate therapists and facilitating therapy sessions.

Communication: To communicate with you about your account, respond to your inquiries, and send you important notices and updates.

Personalization: To personalize your experience, deliver content and product offerings relevant to your interests, and provide targeted advertisements.

Research and Analytics: To conduct research and analyze usage patterns to improve our Services and develop new features.

Legal Compliance: To comply with applicable laws, regulations, and legal processes.

Safety and Security: To protect the safety, integrity, and security of our Services, users, and others.`
    },
    {
      id: "information-sharing",
      title: "How We Share Your Information",
      content: `We may share your information in the following circumstances:

With Your Therapist: We share your information with the therapist(s) you are matched with to facilitate therapy services.

Service Providers: We share information with third-party vendors, consultants, and other service providers who perform services on our behalf, such as payment processing, data analysis, and customer service.

Business Transfers: If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.

Legal Requirements: We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).

Protection of Rights: We may disclose your information to protect the rights, property, or safety of Solace Wave Therapy, our users, or others.

With Your Consent: We may share your information with third parties when you have given us your consent to do so.`
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: `We use cookies and similar tracking technologies to track activity on our Services and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.

We use cookies for various purposes, including:

Remembering your preferences and settings
Keeping you logged in to our Services
Understanding how you use our Services
Improving your experience
Targeting advertisements`
    },
    {
      id: "data-security",
      title: "Data Security",
      content: `We have implemented appropriate technical and organizational measures to protect the security of your information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.

We use industry-standard encryption to protect sensitive information transmitted online. We also protect your information offline, with access restricted to authorized personnel only. All personnel with access to your information are bound by confidentiality obligations.

While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security. If you have reason to believe that your interaction with us is no longer secure, please immediately notify us.`
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: `We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. 

Health information is retained in accordance with applicable healthcare laws and regulations. We may retain de-identified or aggregated data for a longer period for research and analysis purposes.

When we no longer need to use your information, we will take reasonable steps to remove it from our systems and records or to de-identify it.`
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      content: `If you are a parent or guardian and believe that your child has provided us with personal information, please contact us, and we will take steps to delete such information.`
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      content: `Depending on your location, you may have certain rights regarding your personal information, including:

Access: You may request access to your personal information.
Correction: You may request that we correct inaccurate or incomplete information.
Deletion: You may request that we delete your personal information in certain circumstances.
Restriction: You may request that we restrict the processing of your information in certain circumstances.
Data Portability: You may request a copy of the information you have provided to us in a structured, commonly used, and machine-readable format.
Objection: You may object to our processing of your information in certain circumstances.

To exercise these rights, please contact us using the information provided in the "Contact Information" section. We will respond to your request within a reasonable timeframe.

You may also update or modify your account information through your account settings. You can opt-out of receiving promotional emails by following the instructions in those emails. Please note that even if you opt-out of promotional emails, you may still receive administrative emails regarding your account or our Services.`
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      content: `Your information may be transferred to, and maintained on, computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction.

If you are located outside Nigeria and choose to provide information to us, please note that we transfer the information, including personal information, to Nigeria and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.

We will take all steps reasonably necessary to ensure that your information is treated securely and in accordance with this Privacy Policy, and no transfer of your personal information will take place to an organization or a country unless there are adequate controls in place for the security of your information.`
    },
    {
      id: "policy-changes",
      title: "Changes to This Privacy Policy",
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For significant changes, we will provide a more prominent notice, which may include sending you an email notification.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:

Email: solacewavetherapy@gmail.com
Phone: (234) 8064427513
Address: 11 Koforidua street, off mambolo, Wuse Zone 2, Abuja, NG`
    }
  ];

  const handleSectionToggle = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="privacy-page legal-page">
      <Header />
      
      <main className={`legal-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="legal-hero">
          <div className="container">
            <div className="legal-hero-content animate-on-scroll">
              <h1>Privacy Policy</h1>
              <p className="subtitle">Last Updated: {lastUpdated}</p>
              <p className="legal-summary">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information.
              </p>
            </div>
          </div>
        </section>
        
        <section className="legal-body-section">
          <div className="container">
            <div className="legal-container">
              <div className="legal-sidebar animate-on-scroll">
                <h3>Table of Contents</h3>
                <ul className="toc-list">
                  {sections.map((section, index) => (
                    <li key={index}>
                      <a 
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(section.id).scrollIntoView({
                            behavior: 'smooth'
                          });
                        }}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="legal-content-container animate-on-scroll">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    id={section.id}
                    className="legal-section"
                  >
                    <h2>{section.title}</h2>
                    <div className="legal-section-content">
                      {section.content.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="legal-acceptance">
                  <p>
                    By using our Services, you acknowledge that you have read and understood 
                    this Privacy Policy and agree to its terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;