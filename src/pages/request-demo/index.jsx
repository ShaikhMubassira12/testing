import React from "react";
import { Background, Navbar, ParticleScene } from "../../components";

const RequestDemoPage = () => {
  return (
    <div className="app">
      <Background />
      <ParticleScene />
      <Navbar />

      <section className="request-demo">
        <div className="request-demo-inner">
          <div className="request-header">
            <a className="request-back" href="/">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M15 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to home
            </a>
            <div className="request-eyebrow">Discovery Session</div>
            <h1 className="request-title">
              See what Kinnovance could build for you in 30 minutes.
            </h1>
            <p className="request-lede">
              A focused call where we show relevant products we have shipped and
              map your idea into a clear next step.
            </p>
            <div className="request-pills">
              <span className="request-pill">Mini roadmap</span>
              <span className="request-pill">Live product snapshots</span>
              <span className="request-pill">NDA-friendly</span>
            </div>
          </div>

          <div className="request-grid">
            <div className="request-card">
              <h3>What you will get</h3>
              <ul className="request-list">
                <li>A quick tour of similar products we have built</li>
                <li>A tailored feature roadmap and feasibility check</li>
                <li>Clear next steps if you want us to consult or build</li>
              </ul>
              <div className="request-highlight">
                Curious? We share a private demo pack after the call.
              </div>
              <div className="request-focus">
                <div className="request-focus-item">
                  <span className="focus-title">What to bring</span>
                  <span className="focus-value">
                    Your idea, target users, and constraints
                  </span>
                </div>
              </div>
              <div className="request-meta">
                <div className="request-meta-item">
                  <span className="meta-title">Duration</span>
                  <span className="meta-value">30 minutes</span>
                </div>
                <div className="request-meta-item">
                  <span className="meta-title">Format</span>
                  <span className="meta-value">Video call</span>
                </div>
                <div className="request-meta-item">
                  <span className="meta-title">Follow-up</span>
                  <span className="meta-value">Action plan</span>
                </div>
              </div>
            </div>

            <form
              className="request-form"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="field-row">
                <div className="field">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Ayesha Khan"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="workEmail">Work email</label>
                  <input
                    id="workEmail"
                    name="workEmail"
                    type="email"
                    placeholder="ayesha@company.com"
                    required
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="mobileNumber">
                    Mobile number (with country code)
                  </label>
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    inputMode="tel"
                    placeholder="+92 300 1234567"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="interest">What are you interested in?</label>
                  <select
                    id="interest"
                    name="interest"
                    defaultValue="consulting"
                  >
                    <option value="consulting">
                      Product consulting and planning
                    </option>
                    <option value="demo">Product walkthrough</option>
                    <option value="integration">Integration support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="field-row three">
                <div className="field">
                  <label htmlFor="preferredDate">Preferred date</label>
                  <input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="preferredTime">Preferred time</label>
                  <input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="timezone">Timezone</label>
                  <select id="timezone" name="timezone" defaultValue="PKT">
                    <option value="PKT">PKT (UTC+05:00)</option>
                    <option value="GST">GST (UTC+04:00)</option>
                    <option value="UTC">UTC</option>
                    <option value="CET">CET (UTC+01:00)</option>
                    <option value="EST">EST (UTC-05:00)</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="notes">What do you want to build?</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  placeholder="Share your product vision, current stack, or pain points."
                ></textarea>
              </div>
              <div className="form-cta-row">
                <div className="form-slot">
                  Limited discovery slots each week.
                </div>
                <button type="submit" className="btn-primary">
                  <span>Schedule 30-minute meeting</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="form-note">
                We will review your request and confirm via email within 24
                hours.
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestDemoPage;
