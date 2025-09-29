import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  slug: string;
  image_url: string;
  categoryName: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/gamekey/${product.slug}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer">
        <div className="relative h-40 w-full">
          <Image
            src={product.image_url || "/placeholder.png"} // ใส่ path รูปสำรอง
            alt={product.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white truncate">
            {product.title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{product.categoryName}</p>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xl font-bold text-green-400">
              ${product.price.toFixed(2)}
            </p>
            <span className="text-xs text-green-500 border border-green-500 rounded-full px-2 py-1">
              GLOBAL
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
