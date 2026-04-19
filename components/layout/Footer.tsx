export const Footer = () => {
  return (
    <footer className="w-full bg-gray-700 border-t backdrop-blur-sm p-4 text-center text-sm">
      <p className="text-secondary-foreground font-semibold">
        💵💰💸Aceitamos pix, espécie e cartão (com acréscimo)
      </p>
      <br />
      <a
        href="https://www.elcioserviçoson.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground flex flex-col"
      >
        <span className="font-bold">
          &copy; {new Date().getFullYear()} ElcioServiçosOn
        </span>{" "}
        <span> Todos os direitos reservados.</span>
      </a>
    </footer>
  );
};
