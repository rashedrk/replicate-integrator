import { GithubOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";

export default function Home() {
  return (
    <Flex align="center" justify="center"  style={{height:"100vh"}}>
      <Button
        href={`https://github.com/apps/replicate-integrator/installations/new`}
        type="primary"
      >
        <GithubOutlined />
        Github
      </Button>
    </Flex>
  );
}
