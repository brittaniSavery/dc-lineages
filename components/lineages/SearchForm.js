import PropTypes from "prop-types";
import React from "react";
import { Form } from "react-final-form";
import { titleCase } from "title-case";
import {
  HOLIDAYS,
  LINEAGE_SITES_STATUS,
  LINEAGE_STATUS,
  LINEAGE_TYPES,
} from "../../lib/constants";
import Button from "../Button";
import ButtonContainer from "../ButtonContainer";
import CheckboxGroup from "../fields/CheckboxGroup";
import InputField from "../fields/InputField";
import RadioGroup from "../fields/RadioGroup";
import SearchableSelectField from "../fields/SearchableSelectField";
import SelectField from "../fields/SelectField";
import Notification from "../Notification";

export default function SearchForm({
  onSubmit,
  validate,
  allUsers,
  allBreeds,
  maleBreeds,
  femaleBreeds,
}) {
  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, submitting, pristine, values, submitError }) => (
        <form onSubmit={handleSubmit}>
          <div className="columns is-multiline">
            {submitError && (
              <Notification status="error" title="Oops!">
                {submitError}
              </Notification>
            )}
            <div className="column is-12 pb-0">
              <CheckboxGroup
                name="couple"
                options={[
                  "Check this to search for a specific breed combination",
                ]}
              />
            </div>
            {!values.couple && (
              <div className="column is-12">
                <SearchableSelectField
                  name="allBreed"
                  label="Breed"
                  options={allBreeds}
                  isClearable
                  autoFocus
                />
              </div>
            )}
            {values.couple && (
              <div className="column is-12">
                <div className="columns">
                  <div className="column">
                    <SearchableSelectField
                      name="maleBreed"
                      label="Male Breed"
                      options={maleBreeds}
                      isClearable
                    />
                  </div>
                  <div className="column">
                    <SearchableSelectField
                      name="femaleBreed"
                      label="Female Breed"
                      options={femaleBreeds}
                      isClearable
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="column is-12">
              <div className="columns">
                <div className="column is-narrow" style={{ width: "8em" }}>
                  <InputField
                    name="generation"
                    label="Generation"
                    type="number"
                    min="1"
                    style={{ width: "5em" }}
                  />
                </div>
                <div className="column">
                  <SelectField
                    name="type"
                    label="Type"
                    options={LINEAGE_TYPES}
                  />
                </div>
                <div className="column">
                  <SearchableSelectField
                    name="owner"
                    label="Owner"
                    options={allUsers}
                    isClearable
                  />
                </div>
              </div>
            </div>
            <div className="column is-12">
              <div className="columns">
                <div className="column is-narrow" style={{ width: "8em" }}>
                  <CheckboxGroup
                    name="holiday"
                    label="Holiday"
                    options={HOLIDAYS}
                    getOptionLabel={(option) => titleCase(option)}
                  />
                </div>
                <div className="column is-narrow">
                  <RadioGroup
                    name="status"
                    label="Status"
                    options={LINEAGE_STATUS}
                    getOptionLabel={(x) => x.label}
                    getOptionValue={(x) => x.value}
                  />
                </div>
                <div className="column is-narrow">
                  <RadioGroup
                    name="cdc"
                    label={
                      <span>
                        <abbr title="Checker Database Center">CDC</abbr> Entry
                      </span>
                    }
                    options={LINEAGE_SITES_STATUS}
                    getOptionLabel={(x) => x.label}
                    getOptionValue={(x) => x.value}
                  />
                </div>
                <div className="column is-narrow">
                  <RadioGroup
                    name="srogg"
                    label={
                      <span>
                        <abbr title="Special Release Offspring Gifting Group">
                          SROGG
                        </abbr>{" "}
                        Entry
                      </span>
                    }
                    options={LINEAGE_SITES_STATUS}
                    getOptionLabel={(x) => x.label}
                    getOptionValue={(x) => x.value}
                  />
                </div>
              </div>
            </div>
            <div className="column is-12">
              <ButtonContainer alignment="center">
                <Button
                  type="submit"
                  color="primary"
                  loading={submitting}
                  disabled={submitting || pristine}
                >
                  Search
                </Button>
              </ButtonContainer>
            </div>
          </div>
        </form>
      )}
    />
  );
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  validate: PropTypes.func,
  allUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  allBreeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  maleBreeds: PropTypes.arrayOf(PropTypes.string).isRequired,
  femaleBreeds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
