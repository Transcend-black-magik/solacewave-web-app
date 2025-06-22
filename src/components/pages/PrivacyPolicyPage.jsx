import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/legal-pages.css';

const TermsOfServicePage = () => {
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

  // Table of contents sections
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `Welcome to Solace Wave Therapy. These Terms of Service ("Terms") govern your use of our website, mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.`
    },
    {
      id: "definitions",
      title: "Definitions",
      content: `"Company", "we", "us", or "our" refers to Solace Wave Therapy.
"User", "you", or "your" refers to any individual or entity that uses our Services.
"Content" refers to all information, text, graphics, photos, videos, or other materials uploaded, downloaded, or appearing on our Services.
"Therapist" refers to licensed mental health professionals who provide services through our platform.`
    },
    {
      id: "eligibility",
      title: "Eligibility",
      content: `You must be at least old enough (Teenager) to create an account and use our Services. By creating an account and using our Services, you represent that:
1. You have the legal capacity to enter into binding contracts;
2. You are not barred from using our Services under applicable law;
3. You will comply with these Terms and all applicable local, state, national, and international laws, rules, and regulations.`
    },
    {
      id: "account-registration",
      title: "Account Registration and Security",
      content: `To access certain features of our Services, you may be required to register for an account. When registering, you must provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.

We reserve the right to disable any user account if we believe you have violated these Terms or if we determine, in our sole discretion, that your account poses a security risk.`
    },
    {
      id: "service-description",
      title: "Service Description",
      content: `Solace Wave Therapy provides a platform that connects users with licensed mental health professionals for online therapy sessions. Our Services include:
1. Assessment and matching with appropriate therapists;
2. Secure messaging, audio, and video communication with therapists;
3. Scheduling and management of therapy sessions;
4. Educational resources related to mental health.

Our Services are not intended for emergency situations. If you are experiencing a mental health emergency, please call emergency services or the National Suicide Prevention Lifeline at 9-8-8.`
    },
    {
      id: "payment-billing",
      title: "Payment and Billing",
      content: `By subscribing to our Services, you agree to pay all fees associated with your selected plan. All payments are processed securely through our third-party payment processors. Fees are non-refundable except as required by law or as explicitly stated in these Terms.

Subscription fees are billed in advance on either a monthly or annual basis, depending on your selected plan. You authorize us to charge your chosen payment method for all fees incurred. If your payment cannot be completed, we may suspend or terminate your access to our Services.

We reserve the right to change our fees and billing methods at any time. If we make a significant change, we will notify you in advance.`
    },
    {
      id: "cancellation-refunds",
      title: "Cancellation and Refunds",
      content: `You may cancel your subscription at any time through your account settings or by contacting our support team. Upon cancellation, your subscription will remain active until the end of your current billing period, after which it will not renew.

We may offer refunds in certain circumstances, such as technical issues that prevent service delivery or other situations at our discretion. Refund requests should be submitted to our support team and will be evaluated on a case-by-case basis.`
    },
    {
      id: "user-conduct",
      title: "User Conduct",
      content: `When using our Services, you agree not to:
1. Violate any applicable law, regulation, or these Terms;
2. Harass, abuse, or harm another person, including our therapists;
3. Impersonate any person or entity or falsely state your affiliation with a person or entity;
4. Interfere with or disrupt the Services or servers or networks connected to the Services;
5. Use the Services for any illegal or unauthorized purpose;
6. Collect or store personal data about other users without their consent;
7. Create multiple accounts for abusive purposes;
8. Share your account credentials with any third party.

We reserve the right to investigate and take appropriate legal action against anyone who, in our sole discretion, violates this provision, including removing content, terminating accounts, and reporting violators to law enforcement authorities.`
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      content: `The Services and all content, features, and functionality thereof, including but not limited to text, graphics, logos, icons, and software, are owned by Solace Wave Therapy, its licensors, or other providers and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.

You may not copy, modify, create derivative works from, publicly display, publicly perform, republish, download, or transmit any of the material on our Services without our express prior written consent.`
    },
    {
      id: "third-party-links",
      title: "Third-Party Links and Services",
      content: `Our Services may contain links to third-party websites or services that are not owned or controlled by Solace Wave Therapy. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We do not warrant the offerings of any of these entities/individuals or their websites.

You acknowledge and agree that Solace Wave Therapy shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods, or services available on or through any such third-party websites or services.`
    },
    {
      id: "disclaimer",
      title: "Disclaimer of Warranties",
      content: `THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.

SOLACE WAVE THERAPY IS NOT A MEDICAL FACILITY AND DOES NOT PROVIDE MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT. OUR SERVICES ARE NOT INTENDED TO BE A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.`
    },
    {
      id: "limitation-liability",
      title: "Limitation of Liability",
      content: `IN NO EVENT SHALL SOLACE WAVE THERAPY, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES.

OUR LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR OUR SERVICES IS LIMITED TO THE AMOUNT YOU HAVE PAID TO US FOR THE SERVICES IN THE TWELVE MONTHS PRECEDING THE EVENT GIVING RISE TO THE LIABILITY, OR 50,000 NAIRA, WHICHEVER IS GREATER.`
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content: `You agree to defend, indemnify, and hold harmless Solace Wave Therapy, its officers, directors, employees, and agents, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from:
1. Your use of and access to the Services;
2. Your violation of any term of these Terms;
3. Your violation of any third-party right, including without limitation any copyright, property, or privacy right;
4. Any claim that your content caused damage to a third party.

This defense and indemnification obligation will survive these Terms and your use of the Services.`
    },
    {
      id: "modifications",
      title: "Modifications to Terms or Services",
      content: `We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised Terms. If you do not agree to the new Terms, please stop using the Services.`
    },
    {
      id: "governing-law",
      title: "Governing Law and Dispute Resolution",
      content: `These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.

Any dispute arising out of or relating to these Terms or the Services shall first be resolved through good-faith negotiations between the parties. If such negotiations fail, the dispute shall be finally settled through arbitration in accordance with the rules of the Lagos Court of Arbitration. The arbitration shall take place in Abuja, NG, Nigeria, and shall be conducted in the English language.`
    },
    {
      id: "severability",
      title: "Severability",
      content: `If any provision of these Terms is held to be invalid or unenforceable under applicable law, then such provision shall be excluded from these Terms and the remainder of these Terms shall be interpreted as if such provision were so excluded and shall be enforceable in accordance with its terms.`
    },
    {
      id: "entire-agreement",
      title: "Entire Agreement",
      content: `These Terms, together with our Privacy Policy, constitute the entire agreement between you and Solace Wave Therapy regarding the use of our Services, superseding any prior agreements between you and us relating to your use of the Services.`
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `If you have any questions about these Terms, please contact us at:

Email: solacewavetherapy@gmail.com
Phone: (234) 8064427513
Address: 11 Koforidua street, off mambolo, Wuse Zone 2, Abuja, NG`
    }
  ];

  const handleSectionToggle = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  return (
    <div className="terms-page legal-page">
      <Header />
      
      <main className={`legal-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="legal-hero">
          <div className="container">
            <div className="legal-hero-content animate-on-scroll">
              <h1>Terms of Service</h1>
              <p className="subtitle">Last Updated: {lastUpdated}</p>
              <p className="legal-summary">
                Please read these Terms of Service carefully before using our platform.
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
                    By using our Services, you acknowledge that you have read, understood, 
                    and agree to be bound by these Terms of Service.
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

export default TermsOfServicePage;