import Select from 'react-select';

export default function FilterSelect({ changeHandler }) {
  const filterSelectOptions = [
    { value: 'openNow', label: 'Open now' },
    { value: 'fourPlus', label: '4+ stars' },
    { value: 'fourHalfPlus', label: '4.5+ stars' }
  ];
  // Can remove some of this
  const customStyles = {
    control: (base) => ({
      ...base,
      fontSize: '14px',
      height: 'fit-content',
      minHeight: '24px',
      padding: '2px 6px',
      borderRadius: '8px',
      borderColor: 'black',
      borderWidth: '1px',
      borderStyle: 'solid',
      minWidth: 'min-content'
    }),
    valueContainer: (base) => ({
      ...base,
      fontSize: '14px',
      minHeight: '24px',
      height: 'min-content'
    }),
    input: (base) => ({
      ...base,
      fontSize: '14px',
      margin: '0px',
      padding: '0px 0px 5px 0px'
    }),
    placeholder: (base) => ({
      ...base,
      color: 'black'
    }),
    dropdownIndicator: (base) => ({
      ...base,
      fontSize: '14px',
      padding: '0px',
      color: 'black'
    }),
    clearIndicator: (base) => ({
      ...base,
      fontSize: '14px',
      padding: '0px'
    })
  };

  return (
    <Select
      defaultValue={[]}
      isMulti
      name="filterSelect"
      options={filterSelectOptions}
      onChange={changeHandler}
      maxMenuHeight={'fit-content'}
      styles={customStyles}
    />
  );
}
