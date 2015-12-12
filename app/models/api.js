// Example model


function Api (d) {
  if(!d) d = {};
  if(!d.provider) d.provider = {};
  if(!d.map) d.map = {};
  if(!d.map.team_ct) d.map.team_ct = {};
  if(!d.map.team_t) d.map.team_t = {};
  if(!d.round) d.round = {};
  if(!d.player) d.player = {};
  if(!d.player.state) d.player.state = {};
  if(!d.player.weapons) d.player.weapons = {};
  if(!d.player.weapons.weapon_0) d.player.weapons.weapon_0 = {};
  if(!d.player.weapons.weapon_1) d.player.weapons.weapon_1 = {};
  if(!d.player.weapons.weapon_2) d.player.weapons.weapon_2 = {};
  if(!d.player.match_stats) d.player.match_stats = {};

  this.meta = {
      steamId: d.provider.steamid || '',
      version: d.provider.version || 0,
      name: function() {
          if(d.player.name === 'unconnected') {
              return (d.player.name || '');
          }
      }
  };
  this.map = {
      mode: d.map.mode || '',
      name: d.map.name || '',
      phase: d.map.phase || '',
      round: d.map.round || 0,
      scoreCt: d.map.team_ct.score || 0,
      scoreT: d.map.team_t.score || 0
  };
  this.round = {
      phase: d.round.phase,
      win_team: d.round.win_team,
  };
  this.player = {
      team: d.player.team || '',
      activity: d.player.activity || '',
      state: {
          health: d.player.state.health || 100,
          armor: d.player.state.armor || 0,
          helmet: d.player.state.helmet || false,
          flashed: d.player.state.flashed || 0,
          smoked: d.player.state.smoked || 0,
          burning: d.player.state.burning || 0,
          money: d.player.state.money || 0,
          round_kills: d.player.state.round_kills || 0,
          round_killhs: d.player.state.round_killhs || 0
      },
      weapons: {
          weapon_0: {
              name: d.player.weapons.weapon_0.name || '',
              paintkit: d.player.weapons.weapon_0.paintkit || '',
              type: d.player.weapons.weapon_0.type || '',
              state: d.player.weapons.weapon_0.state || ''
          },
          weapon_1: {
              name: d.player.weapons.weapon_1.name || '',
              paintkit: d.player.weapons.weapon_1.paintkit || '',
              type: d.player.weapons.weapon_1.type || '',
              ammo_clip: d.player.weapons.weapon_1.ammo_clip || 0,
              ammo_clip_max: d.player.weapons.weapon_1.ammo_clip_max || 0,
              ammo_reserve: d.player.weapons.weapon_1.ammo_reserve || 0,
              state: d.player.weapons.weapon_1.state || ''
          },
          weapon_2: {
              name: d.player.weapons.weapon_2.name || '',
              paintkit: d.player.weapons.weapon_2.paintkit || '',
              type: d.player.weapons.weapon_2.type || '',
              ammo_clip: d.player.weapons.weapon_2.ammo_clip || 0,
              ammo_clip_max: d.player.weapons.weapon_2.ammo_clip_max || 0,
              ammo_reserve: d.player.weapons.weapon_2.ammo_reserve || 0,
              state: d.player.weapons.weapon_2.state || ''
          }
      },
      match_stats: {
          kills: d.player.state.match_stats || 0,
          assists: d.player.state.match_stats || 0,
          deaths: d.player.state.match_stats || 0,
          mvps: d.player.state.match_stats || 0,
          score: d.player.state.match_stats || 0
      }
  };
}

module.exports = Api;
