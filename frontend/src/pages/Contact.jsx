import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";

const Contact = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const url = "https://bloggigsite-production.up.railway.app";

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);

    const formData = {
      name: form.current.from_name.value, // Send as 'name' instead of 'from_name'
      email: form.current.from_email.value, // Send as 'email' instead of 'from_email'
      subject: form.current.subject.value,
      message: form.current.message.value,
    };

    try {
      // Send to your backend (MongoDB, Firebase, etc.)
      await fetch(`${url}/contact-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Send using EmailJS
      await emailjs.sendForm(
        "service_a8z15ll",
        "template_y8hetuj",
        form.current,
        "tksCvjtmdoFXZ21AE"
      );

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting us. We’ll get back to you shortly.",
        confirmButtonColor: "#1C45C1",
      });

      form.current.reset();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to send message. Please try again later.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSending(false);
    }
  };

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
              <p className="text-muted small mb-0">Lahore, Punjab Pakistan</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-primary fs-3 mb-2">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h6 className="fw-semibold mb-1">Email Us</h6>
              <p className="text-muted small mb-0">connect.thepost@gmail.com</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="bg-white shadow-sm p-4 rounded">
              <div className="text-primary fs-3 mb-2">
                <i className="bi bi-person-fill"></i>
              </div>
              <h6 className="fw-semibold mb-1">Write for Us</h6>
              <p className="text-muted small mb-0">connect.thepost@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h3 className="fw-bold mb-4">Send a Message</h3>
                <form ref={form} onSubmit={sendEmail}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="from_name"
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
                        name="from_email"
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
                        name="subject"
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
                        name="message"
                        className="form-control"
                        id="message"
                        rows="5"
                        placeholder="Write your message here..."
                        required
                      ></textarea>
                    </div>
                    <div className="col-12 text-end">
                      <button
                        type="submit"
                        className="btn btn-primary px-4"
                        disabled={sending}
                      >
                        {sending ? "Sending..." : "Send Message"}
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
