"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa'; // Social icons

// Styled Components
const ContactWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
  animation: fadeIn 1s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.3s;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.5s;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease, transform 0.2s ease;

  &:focus {
    border-color: #0057cc;
    transform: translateY(-2px);
  }

  &:hover {
    border-color: #0057cc;
    transform: translateY(-2px);
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  resize: none;
  height: 150px;
  transition: border-color 0.3s ease, transform 0.2s ease;

  &:focus {
    border-color: #0057cc;
    transform: translateY(-2px);
  }

  &:hover {
    border-color: #0057cc;
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled.button`
  padding: 15px;
  background-color: #0057cc;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #0044aa;
    transform: translateY(-2px);
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 1.2rem;
  margin-top: 20px;
  opacity: 0;
  animation: fadeIn 3s forwards;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Checkmark = styled.span`
  margin-right: 10px;
  font-size: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 30px;

  a {
    font-size: 2rem;
    color: #333;
    transition: color 0.3s ease;

    &:hover {
      color: #0057cc;
    }
  }
`;

const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const success = localStorage.getItem('formSubmitted');
    if (success) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        localStorage.removeItem('formSubmitted'); // Clear after 5 minutes
      }, 5 * 60 * 1000); // 5 minutes in milliseconds
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formDataObj = new FormData(form);
    formDataObj.append('access_key', 'a052fc1b-2cb8-4354-9275-055918e5d7f5'); // Your Web3Form Access Key

    const object = Object.fromEntries(formDataObj.entries());
    const json = JSON.stringify(object);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: json
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
        localStorage.setItem('formSubmitted', 'true'); // Store in localStorage
        setFormData({ name: '', email: '', message: '' }); // Clear form after success
        setTimeout(() => {
          setIsSubmitted(false); // Remove success message after 5 minutes
          localStorage.removeItem('formSubmitted');
        }, 5 * 1000); // 5 minutes in milliseconds
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <ContactWrapper>
      <Heading>Contact Us</Heading>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <SubmitButton type="submit">Submit Form</SubmitButton>
      </Form>

      {isSubmitted && (
        <SuccessMessage>
          <Checkmark>✔</Checkmark> Message Sent Successfully!
        </SuccessMessage>
      )}

      <SocialLinks>
        <a
          href="https://www.linkedin.com/in/raja-mohamed-nawfal-u-523037283/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://wa.me/+918610312714" // Replace with your phone number in international format
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp style={{ fontSize: '2rem', color: '#25D366' }} />
        </a>
      </SocialLinks>
    </ContactWrapper>
  );
};

export default Contact;
