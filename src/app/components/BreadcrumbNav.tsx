import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbNavProps {
  items: string[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  const navigate = useNavigate();

  const handleClick = (index: number) => {
    // Solo navegar si no es el último item (item actual)
    if (index === 0) {
      navigate('/');
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex items-center gap-2 text-sm mb-6"
    >
      {items.map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={() => handleClick(index)}
            className={`transition-colors ${
              index === items.length - 1
                ? 'text-foreground font-medium cursor-default'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            disabled={index === items.length - 1}
          >
            {item}
          </button>
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
}