const Target = ({ targetProp }) => {
  return (
    <>
      {targetProp[1] !== null && (
        <div className="target-right-side">
          <p className="bold">{targetProp[0]}</p>&nbsp;
          <p className="email">({targetProp[1]})</p>
        </div>
      )}
      {targetProp[1] === null && <div className="target-right-side"></div>}
    </>
  );
};

export default Target;
