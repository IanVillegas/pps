// SVG real de Figma (nodo 43121:6904) incrustado directo en el DOM, en vez
// de referenciarlo con <img src="...svg">. Un <img> de SVG puede rasterizar
// a un tamano "natural" y despues escalar ese bitmap por CSS, lo que pixela
// en pantallas grandes (confirmado por el usuario en una laptop real); un
// <svg> inline siempre se dibuja como vector, sin ese paso intermedio.
// width/height del root se cambiaron a 100% (el original traia px fijos);
// el resto del markup (paths, gradiente) es exactamente el que exporto
// Figma, sin modificar.
const SVG_MARKUP = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="100%" height="100%" viewBox="0 0 561.294 729.585" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Vector" d="M178.566 729.585C147.247 729.6 116.481 721.175 89.3804 705.162C48.3258 680.902 18.3773 641.023 6.10208 594.271C-6.1731 547.518 0.227015 497.708 23.8989 455.762L227.899 90.2308C251.807 48.6401 290.869 18.3837 336.562 6.063C382.254 -6.25768 430.869 0.357533 471.799 24.4653C512.729 48.5731 542.652 88.2165 555.038 134.746C567.424 181.275 561.268 230.913 537.914 272.83L333.854 638.331C318.106 666.114 295.463 689.176 268.202 705.195C240.941 721.215 210.026 729.627 178.566 729.585Z" fill="url(#paint0_linear_0_154)"/>
<defs>
<linearGradient id="paint0_linear_0_154" x1="463.499" y1="-66.8786" x2="-64.7197" y2="197.005" gradientUnits="userSpaceOnUse">
<stop stop-color="#E62C3A"/>
<stop offset="1" stop-color="#B22C25"/>
</linearGradient>
</defs>
</svg>`;

const LoginWave1 = ({ className }: { className?: string }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: SVG_MARKUP }} />
);

export default LoginWave1;
