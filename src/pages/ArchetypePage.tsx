import React, {ReactNode, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

const ArchetypePage: React.FC = () => {
  const {archetype} = useParams<{ archetype: string }>();
  const [ArchetypeComponent, setArchetypeComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    import(`../archetypes/${archetype}.tsx`)
      .then(module => {
        setArchetypeComponent(module.default);
      })
      .catch(() => {
        setArchetypeComponent(<div>Archetype not found</div>);
      });
  }, [archetype])

  useEffect(() => {
    document.title = `${archetype}`;
  }, [archetype]);

  return (
    <div>
      {ArchetypeComponent}
    </div>
  )
}

export default ArchetypePage
