import { Box, Flex, Image } from "@chakra-ui/react"
import Logo from "../../assets/logo.png"
const Footer = () => {
  return <footer>
    <Flex bg="rgba(255,255,255, 0.05)">
      <Image src={Logo} height={150} />
    </Flex>
  </footer>
}

export default Footer
