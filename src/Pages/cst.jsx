import React, { useEffect, useState } from "react";
import { Col, Modal, Button, Form, Spinner } from "react-bootstrap";
import CustomTable from "../Components/CustomTable";
import { MdModeEditOutline } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";

const CST = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const columns = [
    { header: "Platform", field: "source_type" },
    { header: "Comment Category", field: "classification_category" },
    { header: "SPOC", field: "spoc_from_brand" },
    {
      header: "Title",
      field: "title",
    },
    {
      header: "Content",
      field: "content",
    },
    { header: "Priority", field: "importance" },
    { header: "Relevency", field: "relevance" },
    { header: "Reply Required", field: "reply_required" },
    { header: "Comment Author", field: "source_name" },
    {
      header: "Action",
      field: "action",
      cell: (row) => (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => handleEditClick(row)}
        >
          <MdModeEditOutline color="#A21094" />
        </span>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://bi_social_tool.mfilterit.net/get_colgate_table_fields"
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://bi_social_tool.mfilterit.net/get_colgate_categories"
      );
      const result = await response.json();
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setSelectedCategory(row.category);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://bi_social_tool.mfilterit.net/update_colgate_category",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ProductID: selectedRow.id,
            Category: selectedCategory,
          }),
        }
      );

      const result = await response.json();

      if (result.status === "Success") {
        toast.success(result.message);
        setShowModal(false);
        fetchData();
      } else {
        console.error("Failed to update category");
        fetchData();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="test">
      <CustomTable loading={loading} columns={columns} data={data?.data} />

      <Toaster />
      {selectedRow && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories?.categories?.map((category) => (
                  <option key={category.key} value={category.value}>
                    {category.key}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CST;
