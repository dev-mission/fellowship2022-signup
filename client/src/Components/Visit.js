function Visit({ id, FirstName, LastName, PhoneNumber, Temperature, TimeIn }) {
  return (
    <tr>
      <td>{FirstName}</td>
      <td>{LastName}</td>
      <td>{PhoneNumber}</td>
      <td>{Temperature}</td>
      <td>{TimeIn}</td>
    </tr>
  );
}

export default Visit;
