function Visit({ id, FirstName, LastName, PhoneNumber, Temperature, TimeIn }) {
  return (
    <tr>
      <td>{FirstName}</td>
      <td>{LastName}</td>
      <td>{PhoneNumber}</td>
      <td>{Temperature}</td>
      <td>{TimeIn}</td>
      <td>
        <button type="button" class="btn btn-outline-primary">
          Sign Out
        </button>
      </td>
    </tr>
  );
}

export default Visit;
