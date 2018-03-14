import moment from 'moment';
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    if (serialized) {
      return moment(serialized).toDate()
    }

    return null;
  },

  serialize(deserialized) {
    if (deserialized) {
      if (deserialized instanceof Date) {
        return moment(deserialized).toISOString();
      } else {
        return moment(deserialized, "YYYY-MM-DDTHH:mm:ssZ").toISOString();
      }
    }
  }
});
