import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";

export default function EmailTemplateGenerator() {
  const [template, setTemplate] = useState("");
  const [variables, setVariables] = useState({});
  const [finalEmail, setFinalEmail] = useState("");
  const [notification, setNotification] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [buttonStyle, setButtonStyle] = useState("");

  useEffect(() => {
    const matches = template.match(/\${(.*?)}/g) || [];
    const uniqueVars = [
      ...new Set(matches.map((v) => v.replace(/\${|}/g, ""))),
    ];

    const updatedVars = {};
    uniqueVars.forEach((varName) => {
      updatedVars[varName] = variables[varName] || "";
    });

    setVariables(updatedVars);
  }, [template]);

  useEffect(() => {
    let emailContent = template;
    Object.keys(variables).forEach((key) => {
      const value = variables[key].trim();
      const regex = new RegExp(`\\\${${key}}`, "g");
      emailContent = emailContent.replace(regex, value || "");
    });

    setFinalEmail(emailContent.replace(/\r\n|\r|\n/g, "\n").trim());
  }, [variables, template]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalEmail);
    setNotification("Email copied to clipboard!");

    setButtonStyle(styles.copyButtonSuccess);
    setTimeout(() => {
      setNotification("");
      setButtonStyle("");
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Email Template Generator</h2>
      <div className={styles.fixedInputContainer}>
        <div className={styles.inputGroup}>
          <label>
            Email Subject:
            <input
              type="text"
              className={styles.fixedInput}
              placeholder="Enter Email Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </label>
        </div>
        <div className={styles.inputGroup}>
          <label>
            Email Address:
            <input
              type="email"
              className={styles.fixedInput}
              placeholder="Enter Email Address"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </label>
        </div>
      </div>
      <h3 className={styles.subtitle}>Email Template:</h3>
      <textarea
        className={styles.textarea}
        placeholder="Paste your email template here..."
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
      />
      <div className={styles.inputContainer}>
        {Object.keys(variables).map((varName) => (
          <div key={varName} className={styles.inputGroup}>
            <label>{varName}:</label>
            <input
              type="text"
              className={styles.input}
              placeholder={`Enter ${varName}`}
              value={variables[varName]}
              onChange={(e) =>
                setVariables((prev) => ({ ...prev, [varName]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>
      <h3 className={styles.subtitle}>Email Preview:</h3>
      <textarea className={styles.emailPreview} value={finalEmail} readOnly />
      <div className={styles.buttonWrapper}>
        <button
          onClick={copyToClipboard}
          className={`${styles.copyButton} ${buttonStyle}`}
        >
          {notification || "Copy to Clipboard"}
        </button>
        {notification && <p className={styles.notification}>{notification}</p>}
        <a
          href={`mailto:?subject=${encodeURIComponent(
            emailSubject
          )}&body=${encodeURIComponent(finalEmail)}`}
          className={styles.emailButton}
        >
          Open Email Client
        </a>
      </div>
    </div>
  );
}
