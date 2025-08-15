import React, { useRef, useEffect } from "react";

export default function KineticTestimonial({
  testimonials = [],
  className = "",
  cardClassName = "",
  avatarClassName = "",
  desktopColumns = 6,
  tabletColumns = 3,
  mobileColumns = 2,
  speed = 1,
  title = "Reviews",
  subtitle = "about reviews",
}) {
  const columnRefs = useRef([]);
  
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const columns = [];
    const numberOfColumns = 6; // Total number of columns across all rows
    const itemsPerColumn = Math.ceil(testimonials.length / numberOfColumns);
    
    for (let i = 0; i < numberOfColumns; i++) {
      const start = i * itemsPerColumn;
      const end = start + itemsPerColumn;
      const columnItems = testimonials.slice(start, end);
      
      if (columnItems.length > 0) {
        columns.push(columnItems);
      }
    }
    
    columnRefs.current = columns;
  }, [testimonials]);

  // Function to distribute testimonials evenly across columns
  const getColumnsData = () => {
    if (testimonials.length === 0) return [];

    // Calculate the number of columns we'll have
    const totalColumns = 6;
    const columnCount = Math.min(totalColumns, testimonials.length);
    
    // Distribute testimonials evenly
    const columns = Array(columnCount).fill().map(() => []);
    let columnIndex = 0;
    
    // First pass - distribute testimonials evenly
    for (let i = 0; i < testimonials.length; i++) {
      columns[columnIndex].push(testimonials[i]);
      columnIndex = (columnIndex + 1) % columnCount;
    }
    
    return columns;
  };

  const columns = getColumnsData();

  return (
    <section className={`overflow-hidden py-12 md:py-20 ${className}`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        <div className="relative flex flex-row gap-4 md:gap-6 justify-center">
          <div
            className="flex flex-row md:flex-nowrap gap-4 md:gap-6"
            style={{
              gridTemplateColumns: `repeat(${desktopColumns}, 1fr)`,
            }}
          >
            {/* First row - moves upward */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 animate-scroll-up"
                 style={{ 
                   animationDuration: `${40 / speed}s`, 
                   animationPlayState: "running" 
                 }}>
              {columns.slice(0, 3).map((column, columnIdx) => (
                <div key={`col-up-${columnIdx}`} className="flex flex-col gap-4 md:gap-6">
                  {column.map((testimonial, idx) => (
                    <TestimonialCard
                      key={`testimonial-up-${columnIdx}-${idx}`}
                      testimonial={testimonial}
                      className={cardClassName}
                      avatarClassName={avatarClassName}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Second row - moves downward */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 animate-scroll-down"
                 style={{ 
                   animationDuration: `${40 / speed}s`, 
                   animationPlayState: "running" 
                 }}>
              {columns.slice(3).map((column, columnIdx) => (
                <div key={`col-down-${columnIdx}`} className="flex flex-col gap-4 md:gap-6">
                  {column.map((testimonial, idx) => (
                    <TestimonialCard
                      key={`testimonial-down-${columnIdx}-${idx}`}
                      testimonial={testimonial}
                      className={cardClassName}
                      avatarClassName={avatarClassName}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, className, avatarClassName }) {
  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl transition-transform duration-300 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Avatar 
          src={testimonial.avatar} 
          name={testimonial.name} 
          className={avatarClassName} 
        />
        <div>
          <h4 className="font-semibold text-base">{testimonial.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.handle}</p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300">{testimonial.review}</p>
    </div>
  );
}

function Avatar({ src, name, className }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={`relative h-10 w-10 rounded-full overflow-hidden ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="object-cover w-full h-full"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="absolute inset-0 flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-sm font-medium"
        style={{ display: src ? "none" : "flex" }}
      >
        {initials}
      </div>
    </div>
  );
}
