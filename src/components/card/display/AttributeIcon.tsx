export function AttributeIcon({src, alt, title}: { src: string, alt?: string, title?: string }) {
  return <img src={src} className={"attribute-icon"} alt={alt} title={title} draggable={false} />
}
