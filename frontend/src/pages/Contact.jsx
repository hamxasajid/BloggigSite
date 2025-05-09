import React from "react";

const Contact = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Get in Touch</h2>
          <p className="text-muted">
            Have a question or just want to say hi? We’d love to hear from you.
          </p>
        </div>

        <div className="row g-4 mb-5 text-center">
          <div className="col-md-4">
            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-primary fs-3 mb-2">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <h6 className="fw-semibold mb-1">Location</h6>
              <p className="text-muted small mb-0">New York, NY</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-primary fs-3 mb-2">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h6 className="fw-semibold mb-1">Email Us</h6>
              <p className="text-muted small mb-0">contact@thepost.com</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-primary fs-3 mb-2">
                <i className="bi bi-person-fill"></i>
              </div>
              <h6 className="fw-semibold mb-1">Write for Us</h6>
              <p className="text-muted small mb-0">contributors@thepost.com</p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h3 className="fw-bold mb-4">Send a Message</h3>
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="subject" className="form-label">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Subject of your message"
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="5"
                        placeholder="Write your message here..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 text-end">
                      <button type="submit" className="btn btn-primary px-4">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
