import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { particles } from "../../config/particles-config";

export function ParticlesBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles id="tsparticles" init={particlesInit} options={particles} />
  );
}
