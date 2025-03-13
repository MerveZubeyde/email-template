import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";

export default function EmailTemplateGenerator() {
  const [template, setTemplate] = useState("");
  const [variables, setVariables] = useState({});
  const [finalEmail, setFinalEmail] = useState("");
  const [notification, setNotification] = useState("");

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

    setTimeout(() => setNotification(""), 5000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Email Template Generator</h2>
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
        <button onClick={copyToClipboard} className={styles.copyButton}>
          Copy to Clipboard
        </button>
        {notification && <p className={styles.notification}>{notification}</p>}
        <a
          href={`mailto:?subject=Internship Inquiry&body=${encodeURIComponent(
            finalEmail
          )}`}
          className={styles.emailButton}
        >
          Open Email Client
        </a>
      </div>
    </div>
  );
}
