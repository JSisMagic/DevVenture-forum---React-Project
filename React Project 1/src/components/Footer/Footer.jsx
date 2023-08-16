import React from "react"
import { Flex, Image, IconButton, Link } from "@chakra-ui/react"
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa"
import Logo from "../../assets/logo.png"

const Footer = () => {
  return (
    <footer>
      <Flex bg="rgba(255,255,255, 0.05)" direction="column" justify="center" align="center" py={4}>
        <Image src={Logo} height={150} />
        <Flex justify="center" py={2}>
          <Link href="https://www.linkedin.com/" isExternal>
            <IconButton
              icon={<FaLinkedin />}
              variant="ghost"
              aria-label="LinkedIn"
              size="2xl"
              colorScheme="blue"
            />
          </Link>
          <Link href="https://www.facebook.com/" isExternal>
            <IconButton
              icon={<FaFacebook />}
              variant="ghost"
              aria-label="Facebook"
              size="2xl"
              colorScheme="blue"
              ml={4}
            />
          </Link>
          <Link href="https://www.instagram.com/" isExternal>
            <IconButton
              icon={<FaInstagram />}
              variant="ghost"
              aria-label="Instagram"
              size="2xl"
              colorScheme="blue"
              ml={4}
            />
          </Link>
        </Flex>
      </Flex>
    </footer>
  )
}

export default Footer
