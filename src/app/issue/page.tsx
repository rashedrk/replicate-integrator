"use client";

import type { FormProps } from "antd";
import { Button, Flex, Form, Input, Select, Spin } from "antd";
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
const { TextArea } = Input;
import { useSearchParams } from "next/navigation";

type FieldType = {
  title: string;
  message: string;
  repo: string;
};

const IssuePage = () => {
  const [repo, setRepo] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");

  useEffect(() => {
    if (queryId) {
      // If id is in the query parameters, store it in localStorage
      localStorage.setItem("integrationId", queryId);
    }
  }, []);

  const integrationId = queryId || localStorage.getItem("integrationId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://replicate-integrator-server.vercel.app/issue/${integrationId}/repo`
        );
        setRepo(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  //creating repository list for select item
  const repoList = repo?.map((item) => ({
    value: item,
    label: item,
  }));

  //form submit actions
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    const issueData = {
      integrationId,
      ...values,
    };
    try {
      const response = await axios.post(
        "https://replicate-integrator-server.vercel.app/issue/create",
        issueData
      );
      console.log(response);

      if (response.status === HttpStatusCode.Created) {
        alert("success");
      } else {
        alert("failed");
      }
    } catch (error) {
      console.log("Failed to create issue:", error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };


  //handle disconnect integration event
  const handleDisconnect = async() => {
    try {
      const response = await axios.delete(
        `https://replicate-integrator-server.vercel.app/integrate/github/${integrationId}`
      );
      console.log(response);

      if (response.status === HttpStatusCode.Ok) {
        alert("success");
      } else {
        alert("failed");
      }
    } catch (error) {
      console.log("Failed to disconnect issue:", error);
    }
  }

  return loading ? (
    <Flex
      justify="center"
      align="center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <Spin />
    </Flex>
  ) : (

      <Flex
        justify="center"
        align="center"
        style={{ height: "90vh", width: "90vw" }}
        vertical
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ minWidth: 500 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Repository"
            name="repo"
            rules={[
              { required: true, message: "Please select your repository!" },
            ]}
          >
            <Select options={repoList} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input your title!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Message"
            name="message"
            rules={[{ required: true, message: "Please input your message!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Button onClick={handleDisconnect} type="default">Disconnect integration</Button>
      </Flex>
  );
};

export default IssuePage;
