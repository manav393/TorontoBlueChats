import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import _default from "react-bootstrap/Modal";

const NewChatModal = (props) => {
  const types = [
    "WhatsApp",
    "Discord",
    "Facebook Messenger",
    "Telegram",
    "Slack",
  ];
  const lecRef = useRef();
  const typeRef = useRef();
  const urlRef = useRef();

  const {
    courseId,
    showNewForm,
    handleNewFormClose,
    lectures,
    selectedLecture,
    reloadGroupchats,
    handleValidation,
    validated,
    handleAlert,
  } = props;

  const validateForm = (link) => {
    return link !== "";
  };
  const addChatHandler = async (event) => {
    if (validateForm(urlRef.current.value)) {
      event.preventDefault();
      const request_obj = {
        type: typeRef.current.value,
        link: urlRef.current.value,
        lecture: lecRef.current.value,
        courseId,
      };
      const response = await fetch("/api/groupchats/", {
        method: "POST",
        body: JSON.stringify(request_obj),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        handleAlert(true, false, "Sucess!");
        handleNewFormClose();
        reloadGroupchats(lecRef.current.value, courseId);
      } else {
        console.log(data);
        handleAlert(true, true, data.message);
        handleNewFormClose();
      }
    } else {
      handleValidation();
      event.preventDefault();
      event.stopPropagation();
    }
  };
  return (
    <>
      <Modal show={showNewForm} onHide={handleNewFormClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={addChatHandler}>
            <Form.Group className="mb-3" controlId="formSection">
              <Form.Label>Lecture Section</Form.Label>
              <Form.Select ref={lecRef} defaultValue={selectedLecture}>
                {lectures.map((lec) => {
                  return (
                    <option value={lec} key={lec}>
                      {lec}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Select ref={typeRef}>
                {types.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group
              validated={validated.toString()}
              className="mb-3"
              controlId="formChatLink"
            >
              <Form.Label>Link</Form.Label>
              <Form.Control
                required={validated}
                isInvalid={validated}
                type="url"
                placeholder="https://example.com"
                ref={urlRef}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a link.
              </Form.Control.Feedback>
            </Form.Group>

            <Modal.Footer>
              <Button
                variant="outline-primary-blue"
                className="custom-squared-button"
                type="Submit"
                style={{
                  borderRadius: "0",
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outline-secondary-red"
                onClick={handleNewFormClose}
                style={{
                  borderRadius: "0",
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewChatModal;
