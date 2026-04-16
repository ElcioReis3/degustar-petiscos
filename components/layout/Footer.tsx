export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background/50 backdrop-blur-sm p-4 text-center text-sm">
      <p className="">💵💰💸Aceitamos pix, espécie e cartão (com acréscimo)</p>
      <br />
      <a
        href="https://www.elcioserviçoson.com.br"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground"
      >
        &copy; {new Date().getFullYear()} ElcioServiçosOn. Todos os direitos
        reservados.
      </a>
    </footer>
  );
};
