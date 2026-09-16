// Ver comentario en LoginWave1.tsx. Esta es la forma blanca que recorta la
// diagonal.
//
// El filtro de sombra original de Figma era un <filter> SVG nativo
// (feOffset+feGaussianBlur, x/y/width/height en userSpaceOnUse). Esta forma
// se estira de manera no uniforme (226% de alto, 91.8% de ancho del
// contenedor): un filtro SVG con userSpaceOnUse sobre contenido estirado asi
// es un caso donde algunos navegadores rasterizan el area del filtro con la
// resolucion del viewBox original (1262x1645) en vez de con el tamano final
// en pantalla (bastante mas grande), lo que se ve borroso/"pixelado" al
// escalar (reportado por el usuario en su laptop, no reproducido de forma
// concluyente en las pruebas de este lado, pero es la causa tecnica mas
// probable: es la unica de las 3 formas con un filtro). Se reemplaza por un
// filtro CSS estandar (aplicado al contenedor, no al SVG), que los
// navegadores rasterizan con el tamano final ya compuesto, sin ese riesgo.
const SVG_MARKUP = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="100%" height="100%" viewBox="0 0 1262 1645" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M402.937 1631C332.969 1631.03 264.233 1612.2 203.687 1576.4C111.966 1522.17 45.0571 1433.02 17.6328 1328.5C-9.79147 1223.99 4.50718 1112.63 57.3932 1018.86L513.154 201.712C566.567 108.736 653.836 41.097 755.92 13.5539C858.004 -13.9891 966.615 0.79927 1058.06 54.6926C1149.5 108.586 1216.35 197.21 1244.02 301.227C1271.69 405.244 1257.94 516.211 1205.77 609.916L749.872 1427C714.688 1489.11 664.1 1540.66 603.196 1576.48C542.292 1612.29 473.223 1631.09 402.937 1631Z" fill="white"/>
</svg>`;

// offset 0/10px y blur 2px vienen del feOffset/feGaussianBlur original;
// color negro 25% de opacidad viene del ultimo feColorMatrix (alpha 0.25).
const DROP_SHADOW_STYLE = {
  filter: 'drop-shadow(0px 10px 2px rgba(0, 0, 0, 0.25))',
};

const LoginWave3 = ({ className }: { className?: string }) => (
  <div
    className={className}
    style={DROP_SHADOW_STYLE}
    dangerouslySetInnerHTML={{ __html: SVG_MARKUP }}
  />
);

export default LoginWave3;
