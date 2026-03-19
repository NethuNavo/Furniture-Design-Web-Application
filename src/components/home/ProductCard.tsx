type ProductCardProps = {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
};

export function ProductCard({ title, description, price, imageUrl }: ProductCardProps) {
  return (
    <article className="group rounded-[1.65rem] p-1 transition duration-300 hover:-translate-y-1">
      <div className="glass-card overflow-hidden rounded-[1.5rem] transition duration-300 group-hover:shadow-soft-lg">
        <img
          src={imageUrl}
          alt={title}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-[1.04] sm:h-68"
        />
      </div>
      <div className="space-y-2 px-2 pt-4">
        <h3 className="text-[1.35rem] font-semibold tracking-tight text-charcoal sm:text-[1.45rem]">{title}</h3>
        <p className="max-w-sm text-[0.95rem] leading-7 text-charcoal/65">{description}</p>
        <p className="pt-1 text-[1.35rem] font-semibold text-charcoal">{price}</p>
      </div>
    </article>
  );
}
