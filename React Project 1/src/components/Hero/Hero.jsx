import { Box, Button, Heading, Image, Stack } from "@chakra-ui/react";
import HeroImg from "../../assets/backround.jpg";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleNavigate = () => navigate(user ? "new-post" : "/sign-up");

  return (
    <Box height="500px" width="100%" position="relative">
      <Stack
        position="absolute"
        zIndex={10}
        top={48}
        left={0}
        right={0}
        textAlign="center"
      >
        <Stack>
          <Heading size="2xl" maxWidth="40%" marginInline="auto">
            Welcome to Dev Venture forum!
          </Heading>
          <Heading maxWidth="50%" marginInline="auto" size="lg">
            Unite, Innovate, and Empower
          </Heading>
        </Stack>
        <Button
          onClick={handleNavigate}
          marginTop={10}
          size="lg"
          width="200px"
          marginInline="auto"
          background="teal.500"
        >
          {user ? "Add new post" : "Join us now"}
        </Button>
      </Stack>
      <Image
        height="100%"
        width="100%"
        objectFit="cover"
        opacity="70%"
        src={HeroImg}
      />
    </Box>
  );
};

export default Hero;
